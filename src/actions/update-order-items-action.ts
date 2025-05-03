"use server";

import connectDB from "@/lib/mongodb";
import Catering from "@/models/cateringModel";
import { CateringDocument } from "@/models/types/catering";
import { revalidatePath } from "next/cache";

export async function updateOrderItemsAction(
    orderId: string,
    itemType: "items" | "customItems",
    items: CateringDocument["items"] | CateringDocument["customItems"],
    advancePaid: number,
    prevTax: number,
    deliveryCharge: number,
    subtotal: number,
    discount: number
) {
    try {
        await connectDB();

        if (!orderId) return { error: "Invalid order ID." };
        if (!items) return { error: "Invalid items." };

        const tax =
            (subtotal * Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0)) / 100;
        const total =
            prevTax > 0
                ? subtotal + tax + deliveryCharge
                : subtotal + deliveryCharge;
        const pendingBalance = total - advancePaid - discount;

        const result = await Catering.updateOne(
            { _id: orderId },
            {
                $set: {
                    [itemType]: items,
                    totalPrice: total.toFixed(2),
                    tax: prevTax > 0 ? tax : 0,
                    pendingBalance: pendingBalance.toFixed(2),
                    fullyPaid: pendingBalance <= 0,
                },
            }
        );

        revalidatePath("/dashboard/orders");

        return { success: true, data: result };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
