import { authOptions } from "@/lib/auth";
import { error400, error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Catering from "@/models/cateringModel";
import TiffinOrderStatus from "@/models/tiffinOrderStatusModel";
import { format } from "date-fns";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "DELIVERY", "MANAGER"]))
            return error403();
        const orderType = req.nextUrl.searchParams.get("orderType");
        if (!orderType) return error400("Invalid order type.");

        const session = await getServerSession(authOptions);
        const storeId = session?.user?.storeId;

        if (!storeId) return error403();

        const storeObjectId =
            mongoose.Types.ObjectId.createFromHexString(storeId);
        const today = format(new Date(), "yyyy-MM-dd");

        const result = {
            total: 0,
            pending: 0,
            completed: 0,
        };

        if (orderType === "tiffin") {
            const tiffinOrderCount = await TiffinOrderStatus.find(
                {
                    store: storeObjectId,
                    date: today,
                    status: { $in: ["PENDING", "DELIVERED"] },
                },
                { select: "status" }
            );
            const tiffinPending = tiffinOrderCount.filter(
                (order) => order.status === "PENDING"
            ).length;
            const tiffinDelivered = tiffinOrderCount.filter(
                (order) => order.status === "DELIVERED"
            ).length;
            result.total = tiffinPending + tiffinDelivered;
            result.pending = tiffinPending;
            result.completed = tiffinDelivered;
        } else {
            const cateringOrderCount = await Catering.find(
                {
                    store: storeObjectId,
                    deliveryDate: today,
                    status: { $in: ["PENDING", "DELIVERED"] },
                },
                { select: "status" }
            );
            const cateringPending = cateringOrderCount.filter(
                (order) => order.status === "PENDING"
            ).length;
            const cateringDelivered = cateringOrderCount.filter(
                (order) => order.status === "DELIVERED"
            ).length;
            result.total = cateringPending + cateringDelivered;
            result.pending = cateringPending;
            result.completed = cateringDelivered;
        }

        return success200({ result });
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        } else {
            return error500({ error: "An unknown error occurred" });
        }
    }
}

export const GET = withDbConnectAndAuth(getHandler);
