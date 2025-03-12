import { authOptions } from "@/lib/auth";
import { error403, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Grocery from "@/models/groceryModel";
import { format } from "date-fns";
import { getServerSession } from "next-auth";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();
        const session = await getServerSession(authOptions);
        const storeId = session?.user?.storeId;
        if (!storeId) return error403();

        const date = req.nextUrl.searchParams.get("date");
        const filter = date
            ? { store: storeId, date: format(new Date(date), "yyyy-MM-dd") }
            : { store: storeId };

        const groceries = await Grocery.find(filter).sort({ date: -1 });

        return success200({ groceries });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error.message;
        else return "An unknown error occurred";
    }
}

export const GET = withDbConnectAndAuth(getHandler);
