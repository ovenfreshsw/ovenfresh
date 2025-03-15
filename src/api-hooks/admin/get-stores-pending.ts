import axios from "@/config/axios.config";
import { RevenueStat } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getStoresPending() {
    const { data } = await axios.get("/api/admin/stores-pending");
    if (data && data.result)
        return data.result as { location: string; data: RevenueStat }[] | null;
    return null;
}

export function useStoresPending() {
    return useQuery({
        queryKey: ["stores-pending"],
        queryFn: getStoresPending,
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
