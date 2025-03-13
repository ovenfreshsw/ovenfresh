"use server";

import connectDB from "@/lib/mongodb";
import CateringCategory from "@/models/cateringCategoryModel";
import { revalidatePath } from "next/cache";

export async function addCategoryAction(formData: FormData) {
    try {
        await connectDB();
        const { id, name } = Object.fromEntries(formData.entries());

        if (!name) {
            return { error: "Invalid data format." };
        }

        await CateringCategory.findByIdAndUpdate(
            id,
            { name },
            { upsert: true }
        );

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
