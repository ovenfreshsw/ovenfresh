import { authOptions } from "@/lib/auth";
import { error403, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Grocery from "@/models/groceryModel";
import { getServerSession } from "next-auth";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();
        const session = await getServerSession(authOptions);
        const storeId = session?.user?.storeId;
        if (!storeId) return error403();

        const groceries = await Grocery.find({ store: storeId });

        return success200({ groceries });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error.message;
        else return "An unknown error occurred";
    }
}

export const GET = withDbConnectAndAuth(getHandler);
