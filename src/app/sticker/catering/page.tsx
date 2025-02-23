import React from "react";
import KitchenStickers from "./pdf-sticker-generator";
import { endOfDay, isValid, startOfDay } from "date-fns";
import connectDB from "@/lib/mongodb";
import Catering from "@/models/cateringModel";
import CateringMenu from "@/models/cateringMenuModel";
import { CateringDocumentPopulate } from "@/models/types/catering";

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
    const orders = (await Catering.find({
        deliveryDate: {
            $gte: fromDate,
            $lte: toDate.setDate(toDate.getDate() + 1),
        },
    }).populate({
        path: "items.itemId",
        model: CateringMenu,
        select: "name",
    })) as CateringDocumentPopulate[];

    return (
        <>
            <KitchenStickers
                orders={orders.map((order) => ({
                    orderId: order.orderId,
                    deliveryDate: order.deliveryDate,
                    customerName: order.customerName,
                    phone: order.customerPhone,
                    items: order.items.map((item) => ({
                        name: item.itemId.name,
                        quantity: item.quantity,
                    })),
                    note: order.note,
                }))}
            />
        </>
    );
};

export default StickerPage;
