"use server";

import { deleteFile } from "@/config/cloudinary.config";
import { withDbConnectAndActionAuth } from "@/lib/withDbConnectAndAuth";
import { ZodCateringMenuSchema } from "@/lib/zod-schema/schema";
import CateringMenu from "@/models/cateringMenuModel";
import { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function editCateringMenuAction(
    menuId: string,
    values: z.infer<typeof ZodCateringMenuSchema>,
    oldImage: string | null,
    oldPublicId: string | null,
    resource?: string | CloudinaryUploadWidgetInfo
) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        const result = ZodCateringMenuSchema.safeParse(values);

        let image = oldImage;
        let publicId = oldPublicId;

        if (resource) {
            image = (resource as CloudinaryUploadWidgetInfo).secure_url;
            publicId = (resource as CloudinaryUploadWidgetInfo).public_id;
        }

        if (oldPublicId && publicId !== oldPublicId) {
            await deleteFile(oldPublicId);
        }

        if (!result.success) {
            return { error: "Invalid data format." };
        }

        await CateringMenu.findByIdAndUpdate(menuId, {
            ...result.data,
            image,
            publicId,
        });

        revalidatePath("/dashboard/menus");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
