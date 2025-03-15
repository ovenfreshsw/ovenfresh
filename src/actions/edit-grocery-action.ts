"use server";

import connectDB from "@/lib/mongodb";
import { ZodGrocerySchema } from "@/lib/zod-schema/schema";
import { revalidatePath } from "next/cache";
import Grocery from "@/models/groceryModel";

export async function editGroceryAction(formData: FormData) {
    try {
        await connectDB();

        const result = ZodGrocerySchema.safeParse(
            Object.fromEntries(formData.entries())
        );

        if (!result.success) {
            return { error: "Invalid data format." };
        }

        const mixed = formData.get("mixed") === "true" ? true : false;

        await Grocery.findByIdAndUpdate(formData.get("id"), {
            $set: {
                item: result.data.item,
                quantity: mixed ? null : result.data.quantity,
                unit: mixed ? "Mixed" : result.data.unit,
                price: result.data.price,
                tax: result.data.tax,
                total: result.data.total,
                date: result.data.date,
            },
        });

        revalidatePath("/dashboard/groceries");

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
