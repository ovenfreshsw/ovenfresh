import axios from "@/config/axios.config";
import { RevenueStat } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getTotalRevenue() {
    const { data } = await axios.get("/api/admin/total-revenue");
    if (data && data.result) return data.result as RevenueStat | null;
    return null;
}

export function useTotalRevenue() {
    return useQuery({
        queryKey: ["total-revenue"],
        queryFn: getTotalRevenue,
    });
}
