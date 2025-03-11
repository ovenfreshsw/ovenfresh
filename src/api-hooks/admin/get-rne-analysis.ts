import axios from "@/config/axios.config";
import { RNEAnalysisProps } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getRneAnalysis() {
    const { data } = await axios.get("/api/admin/rne-analysis");
    if (data && data.result) return data.result as RNEAnalysisProps | null;
    return null;
}

export function useRevenueExpenseAnalysis() {
    return useQuery({
        queryKey: ["rne-analysis"],
        queryFn: getRneAnalysis,
    });
}
