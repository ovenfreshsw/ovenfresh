"use server";

import connectDB from "@/lib/mongodb";
import Grocery from "@/models/groceryModel";
import { revalidatePath } from "next/cache";

export async function deleteGroceryAction(id: string) {
    try {
        await connectDB();

        const deletedUser = await Grocery.deleteOne({ _id: id });

        if (!deletedUser.acknowledged) {
            return { error: "Failed to delete grocery item." };
        }

        revalidatePath("/dashboard/groceries");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
