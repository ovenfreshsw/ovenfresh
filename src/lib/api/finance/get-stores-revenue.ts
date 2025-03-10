import axios from "@/config/axios.config";
import { RevenueStat } from "@/lib/types/finance";
import { headers } from "next/headers";

export async function getStoresRevenueServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/admin/stores-revenue", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.result as { location: string; data: RevenueStat }[] | null;
}
