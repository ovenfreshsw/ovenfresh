import axios from "@/config/axios.config";
import { OrderStatCount } from "@/lib/types/order-stats";
import { useQuery } from "@tanstack/react-query";

export async function handleOrderStats() {
    const { data: result } = await axios.get(`/api/order/stats/today`);
    return result.data as OrderStatCount | null;
}

export function useOrderStatsCount() {
    return useQuery({
        queryKey: ["order", "stats", "today"],
        queryFn: handleOrderStats,
        staleTime: 5 * 60 * 1000,
    });
}
