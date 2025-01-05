import { extractPublicId } from "@/lib/cloudinary";
import {
    error400,
    error403,
    error500,
    success200,
    success201,
} from "@/lib/response";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { ZodCateringMenuSchema } from "@/lib/zod-schema/schema";
import CateringMenu from "@/models/cateringMenuModel";
import { NextRequest } from "next/server";

async function postHandler(req: NextRequest) {
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
    } catch (error: any) {
        return error500({ error: error.message });
    }
}

async function getHandler(req: NextRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();

        const menus = await CateringMenu.find();

        return success200({ menus });
    } catch (error: any) {
        return error500({ error: error.message });
    }
}

export const POST = withDbConnectAndAuth(postHandler);
export const GET = withDbConnectAndAuth(getHandler);
