"use server";

import { ZodStoreSchema } from "@/lib/zod-schema/schema";
import { revalidatePath } from "next/cache";
import Store from "@/models/storeModel";
import { withDbConnectAndActionAuth } from "@/lib/withDbConnectAndAuth";

export async function addStoreAction(formData: FormData) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        const result = ZodStoreSchema.safeParse({
            ...Object.fromEntries(formData.entries()),
            lat: Number(formData.get("lat") as string),
            lng: Number(formData.get("lng") as string),
            dividerLine: JSON.parse(formData.get("dividerLine") as string),
        });

        if (!result.success) {
            return { error: "Invalid data format." };
        }

        await Store.create({
            ...result.data,
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
