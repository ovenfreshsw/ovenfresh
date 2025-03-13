import { error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import CateringCategory from "@/models/cateringCategoryModel";

async function getHandler(req: AuthenticatedRequest) {
    try {
        isRestricted(req.user, ["ADMIN"]);

        const categories = await CateringCategory.find({});

        return success200({ categories });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        return error500({ error: "An unexpected error occurred." });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
