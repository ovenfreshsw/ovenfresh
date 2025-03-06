"use server";

import connectDB from "@/lib/mongodb";
import { ZodStoreSchema } from "@/lib/zod-schema/schema";
import Store from "@/models/storeModel";
import { revalidatePath } from "next/cache";

export async function editStoreAction(formData: FormData) {
    try {
        await connectDB();

        const result = ZodStoreSchema.safeParse(
            Object.fromEntries(formData.entries())
        );

        if (!result.success) {
            return { error: "Invalid data format." };
        }

        await Store.findByIdAndUpdate(formData.get("id"), {
            $set: result.data,
        });

        revalidatePath("/dashboard/stores");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
