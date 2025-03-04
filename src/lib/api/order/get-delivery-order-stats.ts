import axios from "@/config/axios.config";
import { headers } from "next/headers";

type TiffinDeliveryOrderStats = {
    total: number;
    pending: number;
    completed: number;
};

export async function getDeliveryOrderStatsServer(
    orderType: "tiffin" | "catering"
) {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/order/delivery/stats", {
        params: {
            orderType,
        },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (orderType === "tiffin") {
        return data.result as TiffinDeliveryOrderStats | null;
    } else {
        return data.result as any | null;
    }
}
