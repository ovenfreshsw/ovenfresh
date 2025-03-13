import axios from "@/config/axios.config";
import { TiffinDocumentPopulate } from "@/models/types/tiffin";
import { useQuery } from "@tanstack/react-query";

async function getTiffinOrders(limit?: number) {
    const { data } = await axios.get("/api/order/tiffin", {
        params: {
            limit,
        },
    });

    if (data && data.orders)
        return data.orders as TiffinDocumentPopulate[] | null;
    return null;
}

export function useTiffinOrders(limit?: number) {
    return useQuery({
        queryKey: ["order", "tiffin"],
        queryFn: () => getTiffinOrders(limit),
        staleTime: 5 * 60 * 1000,
    });
}
