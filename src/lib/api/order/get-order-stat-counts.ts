import axios from "@/config/axios.config";
import { OrderStatCount } from "@/lib/types/order-stats";
import { headers } from "next/headers";

export async function getOrderStatCountsServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/order/stats/today", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.data as OrderStatCount | null;
}
