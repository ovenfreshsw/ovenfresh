import axios from "@/config/axios.config";
import { RevenueBreakdownProps } from "@/lib/types/finance";
import { headers } from "next/headers";

export async function getRevenueBreakdownServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/admin/revenue-breakdown", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.result as RevenueBreakdownProps[] | null;
}
