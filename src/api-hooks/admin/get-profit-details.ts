import axios from "@/config/axios.config";
import { ProfitDetailsProps } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getProfitDetails(month: string) {
    const { data } = await axios.get("/api/admin/profit-details", {
        params: { month },
    });
    if (data && data.result) return data.result as ProfitDetailsProps[] | null;
    return null;
}

export function useProfitDetails(month: string) {
    return useQuery({
        queryKey: ["profit-details", month],
        queryFn: () => getProfitDetails(month),
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
