"use server";

import connectDB from "@/lib/mongodb";
import { ZodGrocerySchema } from "@/lib/zod-schema/schema";
import { revalidatePath } from "next/cache";
import Grocery from "@/models/groceryModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function addGroceryAction(formData: FormData) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const storeId = session?.user?.storeId;
        if (!storeId) return { error: "Store not found." };

        const result = ZodGrocerySchema.safeParse(
            Object.fromEntries(formData.entries())
        );

        if (!result.success) {
            return { error: "Invalid data format." };
        }

        const mixed = formData.get("mixed") === "true" ? true : false;

        await Grocery.create({
            store: storeId,
            item: result.data.item,
            quantity: mixed ? null : result.data.quantity,
            unit: mixed ? "Mixed" : result.data.unit,
            price: result.data.price,
            tax: result.data.tax,
            total: result.data.total,
            date: result.data.date,
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
