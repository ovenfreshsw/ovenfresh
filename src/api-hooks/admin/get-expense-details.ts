import axios from "@/config/axios.config";
import { ExpenseDetailsProps } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getExpenseDetails(month: string) {
    const { data } = await axios.get("/api/admin/expense-details", {
        params: { month },
    });
    if (data && data.result) return data.result as ExpenseDetailsProps[] | null;
    return null;
}

export function useExpenseDetails(month: string) {
    return useQuery({
        queryKey: ["expense-details", month],
        queryFn: () => getExpenseDetails(month),
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
