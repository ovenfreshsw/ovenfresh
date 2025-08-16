"use server";

import { withDbConnectAndActionAuth } from "@/lib/withDbConnectAndAuth";
import Catering from "@/models/cateringModel";
import { revalidatePath } from "next/cache";

export async function addCustomItemAction(formData: FormData) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        const { orderId, name, priceAtOrder, size } =
            Object.fromEntries(formData);

        if (!orderId || !name || !priceAtOrder || !size) {
            return { error: "Invalid data format." };
        }

        await Catering.findByIdAndUpdate(orderId, {
            $push: {
                customItems: {
                    name: name as string,
                    size: size as string,
                    priceAtOrder: Number(priceAtOrder),
                },
            },
        });

        revalidatePath("/dashboard/orders");
        revalidatePath("/confirm-order/catering/" + orderId);

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
