import { authOptions } from "@/lib/auth";
import { error400, error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import SortedOrders from "@/models/sortedOrdersModel";
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
        const orderType = body.orderType;

        const session = await getServerSession(authOptions);
        const storeId = session?.user?.storeId;

        if (!storeId) return error403();

        if (!orderId || !orderType)
            return error400("Invalid order id or type.");

        const user = await User.findById(session.user.id);
        if (!user) return error403();
        const zone = user.zone;
        if (!zone) return error403();

        if (orderType === "tiffin") {
            await Promise.all([
                TiffinOrderStatus.findByIdAndUpdate(orderId, {
                    status: "DELIVERED",
                }),
                SortedOrders.findOneAndUpdate(
                    {
                        date: format(new Date(), "yyyy-MM-dd"),
                        store: storeId,
                        [`${zone}.tiffin.order`]: orderId,
                    },
                    { $set: { [`${zone}.tiffin.$.status`]: "DELIVERED" } }
                ),
            ]);
        } else {
            // await Promise.all([
            //     Catering.findByIdAndUpdate()
            // ])
        }

        return success200({});
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        return error500({ error: "An unknown error occurred." });
    }
}

export const PATCH = withDbConnectAndAuth(patchHandler);
