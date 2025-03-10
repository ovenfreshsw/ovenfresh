import { error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Catering from "@/models/cateringModel";
import Store from "@/models/storeModel";
import Tiffin from "@/models/tiffinModel";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN"])) return error403();

        const stores = await Store.find({}, "_id location");

        const queryPromise = stores.map(async (store) => {
            const tiffinTotal = await Tiffin.find(
                { store: store._id },
                "totalPrice"
            );
            const cateringTotal = await Catering.find(
                { store: store._id },
                "totalPrice"
            );

            const tiffinSum = tiffinTotal.reduce(
                (sum, tiffin) => sum + tiffin.totalPrice,
                0
            );
            const cateringSum = cateringTotal.reduce(
                (sum, catering) => sum + catering.totalPrice,
                0
            );

            return {
                location: store.location,
                data: {
                    total: tiffinSum + cateringSum,
                    tiffin: tiffinSum,
                    catering: cateringSum,
                },
            };
        });

        // Ensure all promises in queryPromise are resolved
        const result = await Promise.all(queryPromise);

        return success200({ result });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred" });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
