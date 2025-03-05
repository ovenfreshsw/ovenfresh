import axios from "@/config/axios.config";
import { StatCardProps } from "@/lib/types/order-stats";
import { headers } from "next/headers";

export async function getLastMonthStatsServer(type: "tiffin" | "catering") {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/order/stats/last-month", {
        params: {
            model: type,
        },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.result as StatCardProps | null;
}
