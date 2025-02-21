"use server";

import connectDB from "@/lib/mongodb";
import { ZodCustomerSchema } from "@/lib/zod-schema/schema";
import Catering from "@/models/cateringModel";
import Tiffin from "@/models/tiffinModel";
import { revalidatePath } from "next/cache";

export async function editCustomerAction(formData: FormData) {
    try {
        await connectDB();

        const orderId = formData.get("orderId");
        const orderType = formData.get("orderType");
        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName");
        const phone = formData.get("phone");
        const note = formData.get("note");

        const result = ZodCustomerSchema.pick({
            firstName: true,
            lastName: true,
            phone: true,
        }).safeParse({
            firstName: firstName,
            lastName: lastName,
            phone: phone,
        });

        if (!result.success) {
            return { error: result.error };
        }

        if (orderType === "catering") {
            await Catering.updateOne(
                { _id: orderId },
                {
                    $set: {
                        customerName:
                            result.data.firstName + " " + result.data.lastName,
                        customerPhone: result.data.phone.replace(/\s/g, ""),
                        note,
                    },
                }
            );
        } else {
            await Tiffin.updateOne(
                { _id: orderId },
                {
                    $set: {
                        customerName:
                            result.data.firstName + " " + result.data.lastName,
                        customerPhone: result.data.phone.replace(/\s/g, ""),
                        note,
                    },
                }
            );
        }

        revalidatePath("/dashboard/orders");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
