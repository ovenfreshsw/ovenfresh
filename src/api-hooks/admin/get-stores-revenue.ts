import axios from "@/config/axios.config";
import { RevenueStat } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getStoresRevenue() {
    const { data } = await axios.get("/api/admin/stores-revenue");
    if (data && data.result)
        return data.result as { location: string; data: RevenueStat }[] | null;
    return null;
}

export function useStoresRevenue() {
    return useQuery({
        queryKey: ["stores-revenue"],
        queryFn: getStoresRevenue,
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
