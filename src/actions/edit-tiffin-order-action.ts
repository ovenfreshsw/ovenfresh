"use server";

import { ZodTiffinSchema } from "@/lib/zod-schema/schema";
import TiffinMenu from "@/models/tiffinMenuModel";
import Tiffin from "@/models/tiffinModel";
import { revalidatePath } from "next/cache";

// Helper function for form data parsing
const getFormDataValue = (formData: FormData, key: string) =>
    formData.get(key)?.toString().trim() || "";

export async function editTiffinOrderAction(formData: FormData) {
    try {
        // Get form data
        const orderId = getFormDataValue(formData, "orderId");
        const startDate = getFormDataValue(formData, "startDate");
        const updateEndDate = getFormDataValue(formData, "updateEndDate");
        const numberOfWeeks = getFormDataValue(formData, "numberOfWeeks");
        const order_type = getFormDataValue(formData, "order_type");
        const tax = getFormDataValue(formData, "tax");
        const advancePaid = getFormDataValue(formData, "advancePaid");

        // Validate required fields
        if (
            !orderId ||
            !startDate ||
            !numberOfWeeks ||
            !order_type ||
            !tax ||
            !advancePaid
        ) {
            return { error: "Missing required fields." };
        }

        // Parse and validate order data using Zod schema
        const validation = ZodTiffinSchema.pick({
            number_of_weeks: true,
            order_type: true,
        }).safeParse({ number_of_weeks: numberOfWeeks, order_type });

        if (!validation.success) {
            return { error: validation.error };
        }

        // Retrieve tiffin menu
        const tiffinMenu = await TiffinMenu.findOne();
        if (!tiffinMenu) {
            return { error: "Tiffin menu not found." };
        }

        // Validate weeks number
        const weeksNumber = parseFloat(numberOfWeeks);
        if (isNaN(weeksNumber)) {
            return { error: "Invalid number of weeks." };
        }

        // Date calculation
        const start = new Date(startDate);
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const endDate = new Date(start.getTime() + weeksNumber * oneWeek);

        // Calculate total amount
        const calculateTotalAmount = () => {
            const baseAmount =
                order_type === "pickup"
                    ? tiffinMenu?.pickup[`${numberOfWeeks}_weeks`] || 0
                    : tiffinMenu?.delivery[`${numberOfWeeks}_weeks`] || 0;

            const totalTax =
                baseAmount *
                (Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0) / 100);
            return {
                tax: totalTax,
                total: baseAmount + (Number(tax) > 0 ? totalTax : 0),
            };
        };

        // Prepare update data
        const updateData: Record<string, string | number | Date> = {
            numberOfWeeks: validation.data.number_of_weeks,
            order_type: validation.data.order_type,
            totalPrice: calculateTotalAmount().total,
            tax: Number(tax) > 0 ? calculateTotalAmount().tax : 0,
            pendingBalance: calculateTotalAmount().total - Number(advancePaid),
        };

        // Conditionally update end date
        if (updateEndDate === "true") {
            updateData.endDate = endDate;
        }

        // Update order in database
        await Tiffin.updateOne({ _id: orderId }, { $set: updateData });

        // Revalidate the path
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
