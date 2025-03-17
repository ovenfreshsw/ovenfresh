import axios from "@/config/axios.config";
import { RevenueStat } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getStoresRevenue(year: string) {
    const { data } = await axios.get("/api/admin/stores-revenue", {
        params: {
            year,
        },
    });
    if (data && data.result)
        return data.result as { location: string; data: RevenueStat }[] | null;
    return null;
}

export function useStoresRevenue(year: string) {
    return useQuery({
        queryKey: ["revenue", "stores-revenue", year],
        queryFn: () => getStoresRevenue(year),
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
