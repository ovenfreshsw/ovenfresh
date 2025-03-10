import axios from "@/config/axios.config";
import { useQuery } from "@tanstack/react-query";

type Store = "store1" | "store2" | "all";
type Service = "tiffin" | "catering" | "all";
type StoreServiceMap = {
    [key in Store]: {
        [key in Service]: string[];
    };
};

type RNEAnalysisProps = {
    colorMap: Record<string, string>;
    revenueData: any[];
    storeServiceMap: StoreServiceMap;
    stores: {
        value: string;
        name: string;
    }[];
};

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
