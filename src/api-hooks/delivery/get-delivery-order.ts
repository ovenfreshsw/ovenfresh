import axios from "@/config/axios.config";
import { DeliveryOrderStats } from "@/lib/types/order-stats";
import { DeliveryRes } from "@/lib/types/sorted-order";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export async function handleOrders(orderType: "tiffin" | "catering") {
    const { data } = await axios.get("/api/order/delivery", {
        params: { orderType },
    });

    if (!data.data.haveZone)
        toast.error("You don't have a zone assigned for delivery!");
    return data.data as {
        orders: DeliveryRes[];
        result: DeliveryOrderStats;
        haveZone: boolean;
    } | null;
}

export function useDeliveryOrders(orderType: "tiffin" | "catering") {
    return useQuery({
        queryKey: ["delivery", "sortedOrders", orderType],
        queryFn: () => handleOrders(orderType),
        staleTime: 5 * 60 * 1000,
        retry: 4,
    });
}
