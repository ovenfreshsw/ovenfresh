import axios from "@/config/axios.config";
import { RevenueBreakdownProps } from "@/lib/types/finance";
import { format } from "date-fns";
import { headers } from "next/headers";

export async function getRevenueBreakdownServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/admin/revenue-breakdown", {
        params: {
            year: format(new Date(), "yyyy"),
        },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.result as RevenueBreakdownProps[] | null;
}
