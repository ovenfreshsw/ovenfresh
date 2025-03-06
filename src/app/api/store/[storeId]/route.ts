import { error400, error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { ZodStoreSchema } from "@/lib/zod-schema/schema";
import Store from "@/models/storeModel";

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

export const PUT = withDbConnectAndAuth(updateHandler);
