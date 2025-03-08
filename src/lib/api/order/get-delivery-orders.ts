import axios from "@/config/axios.config";
import { DeliveryOrderStats } from "@/lib/types/order-stats";
import { DeliveryRes } from "@/lib/types/sorted-order";
import { headers } from "next/headers";

export async function getDeliveryOrdersServer(
    orderType: "tiffin" | "catering"
) {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/order/delivery", {
        params: {
            orderType,
        },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (orderType === "tiffin") {
        return data.data as {
            orders: DeliveryRes[];
            result: DeliveryOrderStats;
            haveZone: boolean;
        } | null;
    } else {
        return data.data as {
            orders: [];
            result: DeliveryOrderStats;
            haveZone: boolean;
        } | null;
    }
}
