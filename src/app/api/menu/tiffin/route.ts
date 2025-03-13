import { error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import TiffinMenu from "@/models/tiffinMenuModel";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();

        // const store = req.nextUrl.searchParams.get("store");

        // If store is provided, filter by store, otherwise return all
        // const query = store ? { store } : {};

        const tiffinRate = await TiffinMenu.find();

        return success200({ result: tiffinRate[0] });
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        } else {
            return error500({ error: "An unknown error occurred" });
        }
    }
}

export const GET = withDbConnectAndAuth(getHandler);
