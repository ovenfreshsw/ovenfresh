"use server";

import connectDB from "@/lib/mongodb";
import { DayStatus } from "@/lib/types/order-status";
import TiffinOrderStatus from "@/models/tiffinOrderStatusModel";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function updateDayOrderStatusAction(
    orderId: string,
    data: DayStatus[]
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
