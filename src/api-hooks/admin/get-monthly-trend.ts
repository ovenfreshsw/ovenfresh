import axios from "@/config/axios.config";
import { MonthlyExpenseTrendProps } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getMonthlyTrend() {
    const { data } = await axios.get("/api/admin/monthly-trend");
    if (data && data.result)
        return data.result as MonthlyExpenseTrendProps | null;
    return null;
}

export function useMonthlyTrend() {
    return useQuery({
        queryKey: ["monthly-trend"],
        queryFn: getMonthlyTrend,
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
