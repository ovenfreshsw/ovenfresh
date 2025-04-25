import { error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import DeliveryImage from "@/models/deliveryImageModel";
import Store from "@/models/storeModel";
import Tiffin from "@/models/tiffinModel";
import User from "@/models/userModel";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN"])) return error403();

        const proofs = await DeliveryImage.find({})
            .populate({ path: "user", model: User, select: "username" })
            .populate({
                path: "order",
                model: Tiffin,
                select: "orderId _id",
            })
            .populate({
                path: "store",
                model: Store,
                select: "location",
            });

        return success200({
            result: proofs.map((proof) => ({
                _id: proof._id.toString(),
                orderId: proof.order.orderId,
                order_id: proof.order._id,
                user: proof.user.username,
                image: proof.image,
                deliveryDate: proof.deliveryDate,
                store: proof.store.location,
            })),
        });
    } catch (error) {
        console.log(error);

        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred" });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
