"use server";

import { ZodCateringSchema } from "@/lib/zod-schema/schema";
import Catering from "@/models/cateringModel";
import Tiffin from "@/models/tiffinModel";
import { revalidatePath } from "next/cache";

export async function editPaymentAction(formData: FormData) {
    try {
        const {
            orderId,
            orderType,
            tax,
            total,
            paymentMethod,
            advancePaid,
            pendingBalance,
            fullyPaid,
        } = Object.fromEntries(formData.entries());

        if (!orderId) return { error: "Invalid order ID." };
        if (!orderType) return { error: "Invalid order type." };

        const result = ZodCateringSchema.pick({
            tax: true,
            totalPrice: true,
            payment_method: true,
            advancePaid: true,
            pendingBalance: true,
            fullyPaid: true,
        }).safeParse({
            tax: Number(tax),
            totalPrice: Number(total),
            payment_method: paymentMethod,
            advancePaid: Number(advancePaid),
            pendingBalance: Number(pendingBalance),
            fullyPaid: fullyPaid === "true",
        });

        if (!result.success) {
            return { error: result.error };
        }

        if (orderType === "catering") {
            await Catering.updateOne(
                { _id: orderId },
                {
                    $set: {
                        tax: result.data.tax,
                        totalPrice: result.data.totalPrice,
                        paymentMethod: result.data.payment_method,
                        advancePaid: result.data.advancePaid,
                        pendingBalance: result.data.pendingBalance,
                        fullyPaid: result.data.fullyPaid,
                    },
                }
            );
        } else {
            await Tiffin.updateOne(
                { _id: orderId },
                {
                    $set: {
                        tax: result.data.tax,
                        totalPrice: result.data.totalPrice,
                        paymentMethod: result.data.payment_method,
                        advancePaid: result.data.advancePaid,
                        pendingBalance: result.data.pendingBalance,
                        fullyPaid: result.data.fullyPaid,
                    },
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
