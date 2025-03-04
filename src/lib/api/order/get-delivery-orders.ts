import axios from "@/config/axios.config";
import { OrderStatus } from "@/lib/types/order-status";
import { headers } from "next/headers";

type TiffinDeliveryRes = {
    _id: string;
    orderId: string;
    customerName: string;
    customerPhone: string;
    address: string;
    lat: number;
    lng: number;
    fullyPaid: boolean;
    pendingBalance: number;
    totalAmount: number;
    advancePaid: number;
    status: OrderStatus;
};

export async function getDeliveryOrdersServer(
    storeId: string,
    orderType: "tiffin" | "catering"
) {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/order/delivery", {
        params: {
            storeId,
            orderType,
        },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (orderType === "tiffin") {
        return data.orders as TiffinDeliveryRes[] | null;
    } else {
        return data.orders as any[] | null;
    }
}
