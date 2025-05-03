"use server";

import { ZodGrocerySchema } from "@/lib/zod-schema/schema";
import { revalidatePath } from "next/cache";
import Grocery from "@/models/groceryModel";
import { withDbConnectAndActionAuth } from "@/lib/withDbConnectAndAuth";

export async function editGroceryAction(formData: FormData) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        const result = ZodGrocerySchema.safeParse(
            Object.fromEntries(formData.entries())
        );

        if (!result.success) {
            return { error: "Invalid data format." };
        }

        const box = formData.get("box") === "true" ? true : false;

        await Grocery.findByIdAndUpdate(formData.get("id"), {
            $set: {
                item: result.data.item,
                quantity: box ? null : result.data.quantity,
                unit: box ? "Box" : result.data.unit,
                price: result.data.price,
                tax: result.data.tax,
                total: result.data.total,
                purchasedFrom: result.data.purchasedFrom,
                date: result.data.date,
            },
        });

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
