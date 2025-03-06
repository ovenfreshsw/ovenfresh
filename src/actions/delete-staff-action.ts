"use server";

import connectDB from "@/lib/mongodb";
import User from "@/models/userModel";
import { revalidatePath } from "next/cache";

export async function deleteStaffAction(id: string) {
    try {
        await connectDB();

        const deletedUser = await User.deleteOne({ _id: id });

        if (!deletedUser.acknowledged) {
            return { error: "Failed to delete staff" };
        }

        revalidatePath("/dashboard/staffs");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
