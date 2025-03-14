"use server";

import connectDB from "@/lib/mongodb";
import CateringCategory from "@/models/cateringCategoryModel";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function addCategoryAction(formData: FormData) {
    try {
        await connectDB();
        const { id, name } = Object.fromEntries(formData.entries());

        if (!name) {
            return { error: "Invalid data format." };
        }
        let _id = id as string;
        if (!_id) {
            _id = new mongoose.Types.ObjectId().toString();
        }

        await CateringCategory.findByIdAndUpdate(
            _id,
            { name: (name as string).charAt(0).toUpperCase() + name.slice(1) },
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
