import { error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Grocery from "@/models/groceryModel";
import Store from "@/models/storeModel";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN"])) return error403();

        const stores = await Store.find({}, "_id location");

        const queryPromise = stores.map(async (store) => {
            const total = await Grocery.find({ store: store._id }, "total");

            const sum = total.reduce((sum, grocery) => sum + grocery.total, 0);

            return {
                location: store.location,
                total: sum,
                items: total.length,
            };
        });

        // Ensure all promises in queryPromise are resolved
        const storesData = await Promise.all(queryPromise);

        const total = storesData.reduce((sum, store) => sum + store.total, 0);
        const items = storesData.reduce((sum, store) => sum + store.items, 0);

        return success200({
            result: {
                total,
                items,
                stores: storesData,
            },
        });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred" });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
