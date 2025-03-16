"use server";

import { deleteFile } from "@/config/cloudinary.config";
import connectDB from "@/lib/mongodb";
import CateringMenu from "@/models/cateringMenuModel";
import Catering from "@/models/cateringModel";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function deleteCateringMenuAction(id: string) {
    try {
        await connectDB();

        const objectId = mongoose.Types.ObjectId.createFromHexString(id);
        const isMenuInUse = await Catering.findOne({
            items: { $elemMatch: { itemId: objectId } },
        });
        if (isMenuInUse) {
            return { error: "Failed to delete menu item. It is in use." };
        }
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
