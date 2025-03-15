import axios from "@/config/axios.config";
import { RevenueBreakdownProps } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getRevenueBreakdown(month: string) {
    const { data } = await axios.get("/api/admin/revenue-breakdown", {
        params: {
            month,
        },
    });
    if (data && data.result)
        return data.result as RevenueBreakdownProps[] | null;
    return null;
}

export function useRevenueBreakdown(month: string) {
    return useQuery({
        queryKey: ["revenue-breakdown", month],
        queryFn: () => getRevenueBreakdown(month),
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
