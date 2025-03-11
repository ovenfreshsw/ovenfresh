import { error403, error404, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Store from "@/models/storeModel";
import {
    formatRevenueData,
    formatStoreData,
    generateStoreColors,
    getStoreServiceMap,
} from "./helper";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN"])) return error403();

        const stores = await Store.find({}, "location _id");
        if (!stores) return error404("No stores found!");

        const formattedStores = formatStoreData(stores);
        const colors = generateStoreColors(stores);
        const revenueData = await formatRevenueData(stores);
        const storeServiceMap = getStoreServiceMap(stores);

        return success200({
            result: {
                revenueData,
                storeServiceMap,
                colorMap: colors,
                stores: formattedStores,
            },
        });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
