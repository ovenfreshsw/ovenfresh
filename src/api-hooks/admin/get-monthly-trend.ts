import axios from "@/config/axios.config";
import { MonthlyExpenseTrendProps } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getMonthlyTrend(year: string) {
    const { data } = await axios.get("/api/admin/monthly-trend", {
        params: { year },
    });
    if (data && data.result)
        return data.result as MonthlyExpenseTrendProps | null;
    return null;
}

export function useMonthlyTrend(year: string) {
    return useQuery({
        queryKey: ["expense", "monthly-trend", year],
        queryFn: () => getMonthlyTrend(year),
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
