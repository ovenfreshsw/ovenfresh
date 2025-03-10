import axios from "@/config/axios.config";
import { headers } from "next/headers";

export async function getRevenueExpenseAnalysisServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/admin/rne-analysis", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.result as any | null;
}
