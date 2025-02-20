"use server";

import Catering from "@/models/cateringModel";
import Tiffin from "@/models/tiffinModel";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ZodOrderStatusSchema = z.enum([
    "PENDING",
    "IN_PROGRESS",
    "DELIVERED",
    "CANCELLED",
]);

export async function updateOrderStatusAction(
    orderId: string,
    status: string,
    orderType: "catering" | "tiffin",
    settlement: boolean
) {
    try {
        if (!orderId) return { error: "Invalid order ID." };
        if (!status) return { error: "Invalid status." };
        if (!orderType) return { error: "Invalid order type." };

        const validationResult = ZodOrderStatusSchema.safeParse(status);
        if (!validationResult.success) return { error: validationResult.error };

        const data =
            settlement && status === "DELIVERED"
                ? {
                      status: validationResult.data,
                      fullyPaid: true,
                      pendingBalance: 0,
                  }
                : { status: validationResult.data };

        if (orderType === "catering") {
            await Catering.updateOne(
                { _id: orderId },
                {
                    $set: data,
                }
            );
        } else {
            await Tiffin.updateOne(
                { _id: orderId },
                {
                    $set: data,
                }
            );
        }

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
