import axios from "@/config/axios.config";
import { RevenueStat } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getTotalPending() {
    const { data } = await axios.get("/api/admin/total-pending");
    if (data && data.result) return data.result as RevenueStat | null;
    return null;
}

export function useTotalPending() {
    return useQuery({
        queryKey: ["total-pending"],
        queryFn: getTotalPending,
        staleTime: 5 * 60 * 1000,
    });
}
