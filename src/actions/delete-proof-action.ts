"use server";

import connectDB from "@/lib/mongodb";
import DeliveryImage from "@/models/deliveryImageModel";
import { revalidatePath } from "next/cache";

export async function deleteProofAction(id: string) {
    try {
        await connectDB();

        const deletedStore = await DeliveryImage.deleteOne({ _id: id });

        if (!deletedStore.acknowledged) {
            return { error: "Failed to delete proof" };
        }

        revalidatePath("/dashboard/delivery-proof");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
