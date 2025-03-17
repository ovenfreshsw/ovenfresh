import axios from "@/config/axios.config";
import { RevenueStat } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getTotalRevenue(year: string) {
    const { data } = await axios.get("/api/admin/total-revenue", {
        params: {
            year,
        },
    });
    if (data && data.result) return data.result as RevenueStat | null;
    return null;
}

export function useTotalRevenue(year: string) {
    return useQuery({
        queryKey: ["revenue", "total-revenue", year],
        queryFn: () => getTotalRevenue(year),
        staleTime: 5 * 60 * 1000,
    });
}
