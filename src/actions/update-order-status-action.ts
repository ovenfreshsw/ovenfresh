"use server";

import connectDB from "@/lib/mongodb";
import Catering from "@/models/cateringModel";
import Tiffin from "@/models/tiffinModel";
import TiffinOrderStatus from "@/models/tiffinOrderStatusModel";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ZodOrderStatusSchema = z.enum([
    "PENDING",
    "ONGOING",
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
        await connectDB();

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
            if (
                status === "DELIVERED" ||
                status === "CANCELLED" ||
                status === "PENDING"
            ) {
                await Promise.all([
                    await TiffinOrderStatus.updateMany(
                        {
                            orderId,
                            lunch: { $ne: "DELIVERED" },
                        },
                        {
                            $set: {
                                lunch: status, // Set the new status for lunch
                            },
                        }
                    ),
                    // Update dinner if it's not already 'DELIVERED'
                    await TiffinOrderStatus.updateMany(
                        {
                            orderId,
                            dinner: { $ne: "DELIVERED" },
                        },
                        {
                            $set: {
                                dinner: status, // Set the new status for dinner
                            },
                        }
                    ),
                ]);
            }
        }

        revalidatePath("/dashboard/orders");

        return { success: true };
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
