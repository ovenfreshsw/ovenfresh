import axios from "@/config/axios.config";
import { RNEAnalysisProps } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getRneAnalysis(year: string) {
    const { data } = await axios.get("/api/admin/rne-analysis", {
        params: {
            year,
        },
    });
    if (data && data.result) return data.result as RNEAnalysisProps | null;
    return null;
}

export function useRevenueExpenseAnalysis(year: string) {
    return useQuery({
        queryKey: ["revenue", "rne-analysis", year],
        queryFn: () => getRneAnalysis(year),
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
