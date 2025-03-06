import axios from "@/config/axios.config";
import { StoreDocument } from "@/models/types/store";
import { useQuery } from "@tanstack/react-query";

async function getStores() {
    const { data } = await axios.get("/api/store");
    if (data && data.stores) return data.stores as StoreDocument[] | null;
    return null;
}

export function useStores() {
    return useQuery({
        queryKey: ["stores"],
        queryFn: getStores,
        staleTime: Infinity,
    });
}
