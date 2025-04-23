import { getPlaceDetails } from "@/lib/google";
import { error400, error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { ZodStoreSchema } from "@/lib/zod-schema/schema";
import Store from "@/models/storeModel";
import { StoreDocument } from "@/models/types/store";

async function updateHandler(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        if (isRestricted(req.user)) return error403();

        const data = await req.json();
        if (!data) return error400("Invalid data format.");

        const { storeId } = await params;

        const result = ZodStoreSchema.safeParse(data);
        if (!result.success) return error400("Invalid data format.");

        const existingStore = await Store.findById(storeId);
        if (!existingStore) return error400("Store not found.");

        let updateData: Partial<StoreDocument> = result.data;

        if (existingStore.placeId !== result.data.placeId) {
            const location = await getPlaceDetails(result.data.placeId);
            if (!location) return error400("Unable to get coordinates.");
            updateData = {
                ...updateData,
                lat: location.lat,
                lng: location.lng,
            };
        }

        const updatedStore = await Store.findByIdAndUpdate(
            storeId,
            updateData,
            { new: true }
        );
        return success200({ store: updatedStore });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "An unknown error occurred";
        return error500({ error: message });
    }
}

export const PUT = withDbConnectAndAuth(updateHandler);
