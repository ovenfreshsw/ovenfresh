import { authOptions } from "@/lib/auth";
import { error400, error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { capitalizeName, isRestricted } from "@/lib/utils";
import { sendWhatsappMessage } from "@/lib/whatsapp";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Catering from "@/models/cateringModel";
import DeliveryImage from "@/models/deliveryImageModel";
import Setting from "@/models/settingsModel";
import Store from "@/models/storeModel";
import Tiffin from "@/models/tiffinModel";
import TiffinOrderStatus from "@/models/tiffinOrderStatusModel";
import User from "@/models/userModel";
import { format } from "date-fns";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";

async function patchHandler(req: AuthenticatedRequest) {
    try {
        // 1. Check role permissions
        if (isRestricted(req.user, ["ADMIN", "DELIVERY", "MANAGER"])) {
            return error403();
        }

        // 2. Parse request body
        const { orderId, statusId, orderType, collect, url, publicId } =
            await req.json();

        if (!orderId || !orderType) {
            return error400("Invalid order id or type.");
        }

        // 3. Get session & store ID
        const session = await getServerSession(authOptions);
        const storeId = session?.user?.storeId;
        if (!storeId) return error403();

        // 4. Fetch user & validate zone
        const user = await User.findById(session.user.id);
        if (!user?.zone) return error403();

        // 5. Delivery resource details
        const resource = { url, publicId };

        // --- Handle Tiffin Orders ---
        if (orderType === "tiffins") {
            // Update order status
            const orderStatus = await TiffinOrderStatus.findByIdAndUpdate(
                statusId,
                { status: "DELIVERED" },
                { new: true }
            );

            // Fetch related info
            const [order, store] = await Promise.all([
                Tiffin.findById(orderId, "customerPhone customerName _id"),
                Store.findById(storeId, "name"),
            ]);

            // Create delivery proof image entry
            const queries: Promise<unknown>[] = [
                DeliveryImage.create({
                    order: orderId,
                    store: storeId,
                    user: session.user.id,
                    deliveryDate: format(new Date(), "yyyy-MM-dd"),
                    image: resource.url,
                    messageStatus: "unknown",
                    publicId: resource.publicId,
                }),
            ];

            // Mark order as fully paid if collecting payment
            if (collect && orderStatus) {
                queries.push(
                    Tiffin.findByIdAndUpdate(orderStatus.orderId, {
                        pendingBalance: 0,
                        fullyPaid: true,
                    })
                );
            }

            const [deliveryImage] = await Promise.all(queries);

            // Fetch store settings
            const settings = await Setting.findOne({
                store: Types.ObjectId.createFromHexString(storeId),
            });

            // Send WhatsApp message if allowed
            let messageStatus = "stopped";
            if (order && settings && settings.disable_sending_proof === false) {
                try {
                    await sendWhatsappMessage(
                        order.customerPhone,
                        {
                            1: order.customerName,
                            2: format(new Date(), "PPPP p"),
                            3: order.orderId,
                            4: capitalizeName(user.username),
                            5: store?.name || "The Oven Fresh",
                            6: resource.url.split(".com/")[1],
                        },
                        process.env.TWILIO_DELIVERY_PROOF_ID!
                    );
                    messageStatus = "sent";
                } catch {
                    messageStatus = "failed";
                }
            }

            // Update delivery image message status
            await DeliveryImage.findByIdAndUpdate(
                (deliveryImage as { _id: string })._id,
                { messageStatus }
            );

            return success200({
                messageSent: messageStatus !== "failed",
            });
        }

        // --- Handle Catering Orders ---
        const cateringUpdates: Promise<unknown>[] = [
            Catering.findByIdAndUpdate(orderId, { status: "DELIVERED" }),
        ];
        if (collect) {
            cateringUpdates.push(
                Catering.findByIdAndUpdate(orderId, {
                    pendingBalance: 0,
                    fullyPaid: true,
                })
            );
        }
        await Promise.all(cateringUpdates);

        return success200({});
    } catch (error) {
        console.log(error);

        if (error instanceof Error) {
            return error500({ error: error.message });
        }
        return error500({ error: "An unknown error occurred." });
    }
}

export const PATCH = withDbConnectAndAuth(patchHandler);
