"use server";

import { getPlaceDetails } from "@/lib/google";
import { withDbConnectAndActionAuth } from "@/lib/withDbConnectAndAuth";

export async function getStoreCoordinatesAction(placeId: string) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        const location = await getPlaceDetails(placeId);
        if (!location) return { error: "Unable to get coordinates." };

        return { success: true, lat: location.lat, lng: location.lng };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
