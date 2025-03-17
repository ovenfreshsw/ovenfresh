import axios from "@/config/axios.config";
import { RevenueBreakdownProps } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getRevenueBreakdown(year: string, month: string) {
    const { data } = await axios.get("/api/admin/revenue-breakdown", {
        params: {
            year,
            month,
        },
    });
    if (data && data.result)
        return data.result as RevenueBreakdownProps[] | null;
    return null;
}

export function useRevenueBreakdown(year: string, month: string) {
    return useQuery({
        queryKey: ["revenue", "revenue-breakdown", year, month],
        queryFn: () => getRevenueBreakdown(year, month),
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
