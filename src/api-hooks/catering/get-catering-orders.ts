import axios from "@/config/axios.config";
import { CateringDocumentPopulate } from "@/models/types/catering";
import { useQuery } from "@tanstack/react-query";

async function getCateringOrders() {
    const { data } = await axios.get("/api/order/catering", {
        params: {
            storeId: "676cee708588c68c668d3aa7",
        },
    });

    if (data && data.orders)
        return data.orders as CateringDocumentPopulate[] | null;
    return null;
}

export function useCateringOrders() {
    return useQuery({
        queryKey: ["order", "catering"],
        queryFn: getCateringOrders,
    });
}
