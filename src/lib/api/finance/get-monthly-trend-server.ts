import axios from "@/config/axios.config";
import { MonthlyExpenseTrendProps } from "@/lib/types/finance";
import { headers } from "next/headers";

export async function getMonthlyTrendServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/admin/monthly-trend", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.result as MonthlyExpenseTrendProps | null;
}
