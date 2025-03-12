"use server";

import connectDB from "@/lib/mongodb";
import { ZodStoreSchema } from "@/lib/zod-schema/schema";
import { revalidatePath } from "next/cache";
import Store from "@/models/storeModel";
import { getPlaceDetails } from "@/lib/google";

export async function addStoreAction(formData: FormData) {
    try {
        await connectDB();

        const result = ZodStoreSchema.safeParse(
            Object.fromEntries(formData.entries())
        );

        if (!result.success) {
            return { error: "Invalid data format." };
        }

        const location = await getPlaceDetails(result.data.placeId);
        if (!location) return { error: "Unable to get coordinates." };

        await Store.create({
            ...result.data,
            lat: location.lat,
            lng: location.lng,
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
