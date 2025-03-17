import axios from "@/config/axios.config";
import { RevenueStat } from "@/lib/types/finance";
import { format } from "date-fns";
import { headers } from "next/headers";

export async function getTotalRevenueServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/admin/total-revenue", {
        params: {
            year: format(new Date(), "yyyy"),
        },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.result as RevenueStat | null;
}
