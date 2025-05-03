"use server";

import { getPlaceDetails } from "@/lib/google";
import { withDbConnectAndActionAuth } from "@/lib/withDbConnectAndAuth";
import { ZodStoreSchema } from "@/lib/zod-schema/schema";
import Store from "@/models/storeModel";
import { StoreDocument } from "@/models/types/store";
import { revalidatePath } from "next/cache";

export async function editStoreAction(formData: FormData) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        const result = ZodStoreSchema.safeParse(
            Object.fromEntries(formData.entries())
        );

        if (!result.success) {
            return { error: "Invalid data format." };
        }

        const storeId = formData.get("id");

        const existingStore = await Store.findById(storeId);
        if (!existingStore) return { error: "Store not found." };

        let updateData: Partial<StoreDocument> = result.data;

        if (existingStore.placeId !== result.data.placeId) {
            const location = await getPlaceDetails(result.data.placeId);
            console.log(location, "NOW");

            if (!location) return { error: "Unable to get coordinates." };
            updateData = {
                ...updateData,
                lat: location.lat,
                lng: location.lng,
            };
        }
        await Store.findByIdAndUpdate(storeId, {
            $set: updateData,
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
