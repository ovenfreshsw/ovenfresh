"use server";

import { sendWhatsappMessage } from "@/lib/whatsapp";
import { withDbConnectAndActionAuth } from "@/lib/withDbConnectAndAuth";
import Catering from "@/models/cateringModel";
import Tiffin from "@/models/tiffinModel";
import { CateringDocument } from "@/models/types/catering";
import { TiffinDocument } from "@/models/types/tiffin";

export async function sentOrderToWhatsappAction(
    orderId: string,
    orderType: string
) {
    try {
        if (!orderId) return { error: "No order id provided" };
        // Authorize the user
        await withDbConnectAndActionAuth();

        let order: TiffinDocument | CateringDocument | null = null;

        if (orderType === "tiffin") {
            order = (await Tiffin.findById(
                orderId,
                "customerPhone customerName _id"
            )) as TiffinDocument;
        } else if (orderType === "catering") {
            order = (await Catering.findById(
                orderId,
                "customerPhone customerName _id"
            )) as CateringDocument;
        }

        if (!order) return { error: "Order not found" };

        await sendWhatsappMessage(
            order.customerPhone,
            {
                1: order.customerName,
                2: "tiffin/" + order._id.toString(),
            },
            process.env.TWILIO_ORDER_CONFIRM_ID!
        );

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
