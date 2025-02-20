import axios from "@/config/axios.config";
import { TiffinDocumentPopulate } from "@/models/types/tiffin";
import { useQuery } from "@tanstack/react-query";

async function getTiffinOrders() {
    const { data } = await axios.get("/api/order/tiffin", {
        params: {
            storeId: "676cee708588c68c668d3aa7",
        },
    });

    if (data && data.orders)
        return data.orders as TiffinDocumentPopulate[] | null;
    return null;
}

export function useTiffinOrders() {
    return useQuery({
        queryKey: ["order", "tiffin"],
        queryFn: getTiffinOrders,
    });
}
