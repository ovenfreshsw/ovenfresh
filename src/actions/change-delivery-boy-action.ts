"use server";

import { withDbConnectAndActionAuth } from "@/lib/withDbConnectAndAuth";
import User from "@/models/userModel";

export async function changeDeliveryBoyAction(staff: string, zone: number) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        await User.findByIdAndUpdate(staff, { zone });

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
