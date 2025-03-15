import { error403, error404, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { getMonthInNumber, isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Store from "@/models/storeModel";
import { formatRevenueBreakdown } from "./helper";
import { format } from "date-fns";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN"])) return error403();

        const month =
            req.nextUrl.searchParams.get("month") ||
            format(new Date(), "MMM").toLowerCase();
        const monthNumber = getMonthInNumber(month);

        const stores = await Store.find({}, "location _id");
        if (!stores) return error404("No stores found!");

        const revenueData = await formatRevenueBreakdown(stores, monthNumber);

        return success200({ result: revenueData });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
