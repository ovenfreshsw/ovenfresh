import { authOptions } from "@/lib/auth";
import { error400, error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Catering from "@/models/cateringModel";
import DeliveryImage from "@/models/deliveryImageModel";
import Tiffin from "@/models/tiffinModel";
import TiffinOrderStatus from "@/models/tiffinOrderStatusModel";
import User from "@/models/userModel";
import { format } from "date-fns";
import { getServerSession } from "next-auth";

async function patchHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "DELIVERY", "MANAGER"]))
            return error403();
        const body = await req.json();
        const orderId = body.orderId;
        const statusId = body.statusId;
        const orderType = body.orderType;
        const collect = body.collect;

        // If order is tiffin
        const resource = {
            url: body.url,
            publicId: body.publicId,
        };

        const session = await getServerSession(authOptions);
        const storeId = session?.user?.storeId;

        if (!storeId) return error403();

        if (!orderId || !orderType)
            return error400("Invalid order id or type.");

        const user = await User.findById(session.user.id);
        if (!user) return error403();
        const zone = user.zone;
        if (!zone) return error403();

        if (orderType === "tiffins") {
            const orderStatus = await TiffinOrderStatus.findByIdAndUpdate(
                statusId,
                {
                    status: "DELIVERED",
                },
                { new: true }
            );

            const queries: unknown = [
                DeliveryImage.create({
                    order: orderId,
                    store: storeId,
                    user: session.user.id,
                    deliveryDate: format(new Date(), "yyyy-MM-dd"),
                    image: resource.url,
                    publicId: resource.publicId,
                }),
            ];
            if (collect && orderStatus) {
                // @ts-expect-error: Type 'Promise<void>[]' is not assignable to type 'Promise<unknown>[]'.
                queries.push(
                    Tiffin.findByIdAndUpdate(orderStatus.orderId, {
                        pendingBalance: 0,
                        fullyPaid: true,
                    })
                );
            }
            await Promise.all(queries as []);
        } else {
            const queries: unknown = [
                Catering.findByIdAndUpdate(orderId, {
                    status: "DELIVERED",
                }),
            ];

            if (collect) {
                // @ts-expect-error: Type 'Promise<void>[]' is not assignable to type 'Promise<unknown>[]'.
                queries.push(
                    Catering.findByIdAndUpdate(orderId, {
                        pendingBalance: 0,
                        fullyPaid: true,
                    })
                );
            }
            await Promise.all(queries as []);
        }

        return success200({});
    } catch (error) {
        console.log(error);

        if (error instanceof Error) return error500({ error: error.message });
        return error500({ error: "An unknown error occurred." });
    }
}

export const PATCH = withDbConnectAndAuth(patchHandler);
