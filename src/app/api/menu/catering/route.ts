import { extractPublicId } from "@/config/cloudinary.config";
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
import { ZodCateringMenuSchema } from "@/lib/zod-schema/schema";
import CateringMenu from "@/models/cateringMenuModel";

async function postHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();

        const data = await req.json();
        if (!data) {
            return error400("Invalid data format.", {});
        }

        const result = ZodCateringMenuSchema.safeParse(data);

        if (result.success) {
            const publicId = extractPublicId(result.data.image || "");
            const menu = await CateringMenu.create({
                ...result.data,
                publicId,
            });
            return success201({ menu });
        }

        if (result.error) {
            return error400("Invalid data format.", {});
        }
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        } else {
            return error500({ error: "An unknown error occurred" });
        }
    }
}

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();

        const menus = await CateringMenu.find({ disabled: false });

        return success200({ result: menus });
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
