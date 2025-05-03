"use server";

import { withDbConnectAndActionAuth } from "@/lib/withDbConnectAndAuth";
import TiffinMenu from "@/models/tiffinMenuModel";
import { revalidatePath } from "next/cache";

export async function editTiffinMenuAction({
    pickupMenu,
    deliveryMenu,
}: {
    pickupMenu: { [k: string]: number };
    deliveryMenu: { [k: string]: number };
}) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        await TiffinMenu.updateOne(
            {},
            {
                $set: {
                    pickup: pickupMenu,
                    delivery: deliveryMenu,
                },
            }
        );

        revalidatePath("/dashboard/menus");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
