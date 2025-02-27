"use server";

import connectDB from "@/lib/mongodb";
import TiffinOrderStatus from "@/models/tiffinOrderStatusModel";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function updateDayOrderStatusAction(
    orderId: string,
    data: { _id: string; status: "PENDING" | "ONGOING" | "DELIVERED" }[]
) {
    try {
        await connectDB();

        if (!orderId) return { error: "Invalid order ID." };

        const bulkOps = data.map(({ _id, status }) => ({
            updateOne: {
                filter: {
                    _id: mongoose.Types.ObjectId.createFromHexString(_id),
                }, // Convert _id if necessary
                update: { $set: { status } },
            },
        }));

        await TiffinOrderStatus.bulkWrite(bulkOps);

        revalidatePath("/dashboard/orders");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
