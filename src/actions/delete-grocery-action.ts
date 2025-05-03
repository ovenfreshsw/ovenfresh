"use server";

import { withDbConnectAndActionAuth } from "@/lib/withDbConnectAndAuth";
import Grocery from "@/models/groceryModel";
import { revalidatePath } from "next/cache";

export async function deleteGroceryAction(id: string) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        const deleted = await Grocery.deleteOne({ _id: id });

        if (!deleted.acknowledged) {
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
