import {
    error400,
    error403,
    error500,
    success200,
    success201,
} from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import TiffinMenu from "@/models/tiffinMenuModel";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();

        const store = req.nextUrl.searchParams.get("store");

        // If store is provided, filter by store, otherwise return all
        const query = store ? { store } : {};

        const tiffinRate = await TiffinMenu.findOne(query);

        return success200({ result: tiffinRate });
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        } else {
            return error500({ error: "An unknown error occurred" });
        }
    }
}

async function postHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();

        const body = await req.json();

        if (!body.store) return error400("store is required");
        if (
            !body.pickup ||
            !body.pickup["2_weeks"] ||
            !body.pickup["3_weeks"] ||
            !body.pickup["4_weeks"]
        )
            return error400("pickup price is required");
        if (
            !body.delivery ||
            !body.delivery["2_weeks"] ||
            !body.delivery["3_weeks"] ||
            !body.delivery["4_weeks"]
        )
            return error400("delivery price is required");

        const tiffinMenu = await TiffinMenu.create({
            store: body.price,
            pickup: body.pickup,
            delivery: body.delivery,
        });

        return success201({ result: tiffinMenu });
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        } else {
            return error500({ error: "An unknown error occurred" });
        }
    }
}

export const POST = withDbConnectAndAuth(postHandler);
export const GET = withDbConnectAndAuth(getHandler);
