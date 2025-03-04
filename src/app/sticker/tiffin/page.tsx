import React from "react";
import KitchenStickers from "./pdf-sticker-generator";
import { endOfDay, isValid, startOfDay } from "date-fns";
import connectDB from "@/lib/mongodb";
import TiffinOrderStatus from "@/models/tiffinOrderStatusModel";
import Tiffin from "@/models/tiffinModel";

const StickerPage = async ({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const from = (await searchParams)?.from as string;
    const to = (await searchParams)?.to as string;

    // Parse dates and check validity
    const fromDate = isValid(new Date(from))
        ? new Date(from)
        : startOfDay(new Date());
    const toDate = isValid(new Date(to)) ? new Date(to) : endOfDay(new Date());

    await connectDB();
    const orders = await TiffinOrderStatus.find({
        date: {
            $gte: fromDate,
            $lte: toDate,
        },
        status: { $in: ["PENDING", "ONGOING"] },
    }).populate({
        path: "orderId",
        model: Tiffin,
        select: "customerName customerPhone orderId order_type note",
    });

    return (
        <>
            <KitchenStickers
                orders={orders.map((order) => ({
                    orderId: order.orderId.orderId,
                    deliveryDate: order.date,
                    customerName: order.orderId.customerName,
                    order_type: order.orderId.order_type,
                    phone: order.orderId.customerPhone,
                    note: order.orderId.note,
                }))}
            />
        </>
    );
};

export default StickerPage;
