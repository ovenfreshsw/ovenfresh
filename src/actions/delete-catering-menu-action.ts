"use server";

import connectDB from "@/lib/mongodb";
import CateringMenu from "@/models/cateringMenuModel";
import { revalidatePath } from "next/cache";

export async function deleteCateringMenuAction(id: string) {
    try {
        await connectDB();

        const deletedUser = await CateringMenu.deleteOne({ _id: id });

        if (!deletedUser.acknowledged) {
            return { error: "Failed to delete menu item." };
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
