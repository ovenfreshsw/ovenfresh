import { error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import CateringCategory from "@/models/cateringCategoryModel";
import CateringMenu from "@/models/cateringMenuModel";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();

        const disabled = req.nextUrl.searchParams.get("disabled") || "true";
        const query = disabled === "true" ? {} : { disabled: false };

        const menus = await CateringMenu.find(query).populate({
            path: "category",
            model: CateringCategory,
        });

        return success200({ result: menus });
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        } else {
            return error500({ error: "An unknown error occurred" });
        }
    }
}

export const GET = withDbConnectAndAuth(getHandler);
