import { error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { findOptimalRoute, isRestricted } from "@/lib/utils";
import { format } from "date-fns";
import { formatCatering, getCaterings, groupByZone } from "../helper";
import { CateringInputProps, TiffinInputProps } from "@/lib/types/delivery";
import Store from "@/models/storeModel";
import User from "@/models/userModel";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER", "DELIVERY"]))
            return error403();

        const storeId = req.user?.storeId;
        const userId = req.user?.id;

        if (!storeId) return error403();
        if (!userId) return error403();

        const store = await Store.findById(storeId);
        if (!store) return error500({ error: "Store not found." });

        const user = await User.findById(userId);
        if (!user) return error500({ error: "User not found." });

        const date = format(new Date(), "yyyy-MM-dd");

        const caterings = await getCaterings(storeId, date);

        const cateringDelivery = caterings.filter(
            (o) => o.order_type === "delivery"
        );

        const cateringInput = cateringDelivery.map((order) => ({
            ...order._doc,
            id: order._id,
            lat: order.address.lat,
            lng: order.address.lng,
        })) as CateringInputProps[];

        const storeCoords = { lat: store.lat, lng: store.lng };

        const { zone1: cateringUp, zone2: cateringDown } = groupByZone(
            cateringInput,
            (o) => ({ lat: o.lat, lng: o.lng }),
            store.dividerLine
        );

        let sortedC: (TiffinInputProps | CateringInputProps)[] = [];

        if (user.zone === 1) {
            sortedC = findOptimalRoute(storeCoords, cateringUp);
        } else if (user.zone === 2) {
            sortedC = findOptimalRoute(storeCoords, cateringDown);
        }

        return success200({
            data: {
                // @ts-expect-error: Type 'any' is not assignable to type 'TiffinInputProps'.
                orders: sortedC.map(formatCatering),
                stats: {
                    total: sortedC.length,
                    delivered: sortedC.filter((o) => o.status === "DELIVERED")
                        .length,
                    pending: sortedC.filter((o) => o.status === "PENDING")
                        .length,
                },
            },
        });
    } catch (error) {
        console.error(error);
        const message =
            error instanceof Error
                ? error.message
                : "An unknown error occurred";
        return error500({ error: message });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
