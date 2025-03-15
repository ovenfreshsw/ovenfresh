import axios from "@/config/axios.config";
import { DeliveryProof } from "@/lib/types/delivery";
import { useQuery } from "@tanstack/react-query";

async function getDeliveryProofs() {
    const { data } = await axios.get("/api/admin/delivery-proof");
    if (data && data.result) return data.result as DeliveryProof[] | null;
    return null;
}

export function useDeliveryProofs() {
    return useQuery({
        queryKey: ["delivery-proof"],
        queryFn: getDeliveryProofs,
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
        retry: 3,
    });
}
