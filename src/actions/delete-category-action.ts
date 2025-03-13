"use server";

import connectDB from "@/lib/mongodb";
import CateringCategory from "@/models/cateringCategoryModel";
import CateringMenu from "@/models/cateringMenuModel";
import { revalidatePath } from "next/cache";

export async function deleteCategoryAction(id: string) {
    try {
        await connectDB();

        const isCategoryInUse = await CateringMenu.findOne({ category: id });
        if (!isCategoryInUse) {
            const deleted = await CateringCategory.deleteOne({ _id: id });

            if (!deleted.acknowledged) {
                return { error: "Failed to delete category" };
            }

            revalidatePath("/dashboard/menus");

            return { success: true };
        }

        return {
            error: "Category cannot be deleted – in use by catering menus.",
        };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
