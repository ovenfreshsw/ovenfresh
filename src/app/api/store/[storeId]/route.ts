import {
    error400,
    error403,
    error409,
    error500,
    success200,
} from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { ZodStoreSchema } from "@/lib/zod-schema/schema";
import Store from "@/models/storeModel";
import User from "@/models/userModel";

async function updateHandler(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        if (isRestricted(req.user)) return error403();

        const data = await req.json();

        if (!data) {
            return error400("Invalid data format.", {});
        }

        const { storeId } = await params;

        const result = ZodStoreSchema.safeParse(data);

        if (result.success) {
            const existingStore = await Store.findOne({
                _id: storeId,
            });

            if (!existingStore) {
                return error400("User not found.");
            }

            const updatedStore = await Store.findOneAndUpdate(
                { _id: storeId },
                result.data,
                { new: true }
            );

            return success200({ store: updatedStore });
        }

        if (result.error) {
            return error400("Invalid data format.", {});
        }
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        } else {
            return error500({ error: "An unknown error occurred" });
        }
    }
}

async function deleteHandler(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        if (req.user?.role !== "ADMIN") {
            return error403();
        }

        const { storeId } = await params;
        // Step 1: Check if any users have this storeId
        const userWithStore = await User.findOne({ storeId: storeId });

        if (userWithStore) {
            // If users are associated, block deletion
            return error409(
                "Cannot delete this store. There are users associated with this store."
            );
        }

        const deletedStore = await Store.deleteOne({ _id: storeId });

        if (!deletedStore.acknowledged) {
            return error500({ error: "Failed to delete store" });
        }

        return success200({});
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        } else {
            return error500({ error: "An unknown error occurred" });
        }
    }
}

export const PUT = withDbConnectAndAuth(updateHandler);
export const DELETE = withDbConnectAndAuth(deleteHandler);
