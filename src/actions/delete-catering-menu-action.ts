"use server";

import { deleteFile, extractPublicId } from "@/config/cloudinary.config";
import connectDB from "@/lib/mongodb";
import CateringMenu from "@/models/cateringMenuModel";
import { revalidatePath } from "next/cache";

export async function deleteCateringMenuAction(id: string) {
    try {
        await connectDB();

        const deletedMenu = await CateringMenu.findByIdAndDelete({ _id: id });

        if (!deletedMenu) {
            return { error: "Failed to delete menu item." };
        }

        const publicId = deletedMenu.publicId;
        if (publicId) {
            await deleteFile(publicId);
        }

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
