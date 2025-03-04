import axios from "@/config/axios.config";
import { TiffinDeliveryOrderStats } from "@/lib/types/order-stats";
import { useQuery } from "@tanstack/react-query";

export async function handleOrderStats(orderType: "tiffin" | "catering") {
    const { data: result } = await axios.get("/api/order/delivery/stats", {
        params: { orderType },
    });
    return result.data as TiffinDeliveryOrderStats | null;
}

export function useDeliveryOrderStats(orderType: "tiffin" | "catering") {
    return useQuery({
        queryKey: ["delivery", "stats", orderType],
        queryFn: () => handleOrderStats(orderType),
        staleTime: 5 * 60 * 1000,
        retry: 4,
    });
}
