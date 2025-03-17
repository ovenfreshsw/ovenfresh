import axios from "@/config/axios.config";
import { ProfitDetailsProps } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getProfitDetails(month: string, year: string) {
    const { data } = await axios.get("/api/admin/profit-details", {
        params: { month, year },
    });
    if (data && data.result) return data.result as ProfitDetailsProps[] | null;
    return null;
}

export function useProfitDetails(month: string, year: string) {
    return useQuery({
        queryKey: ["profit-details", year, month],
        queryFn: () => getProfitDetails(month, year),
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
