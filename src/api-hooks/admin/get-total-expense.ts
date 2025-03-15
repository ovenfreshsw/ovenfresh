import axios from "@/config/axios.config";
import { ExpenseStat } from "@/lib/types/finance";
import { useQuery } from "@tanstack/react-query";

export async function getTotalExpense() {
    const { data } = await axios.get("/api/admin/total-expense");
    if (data && data.result) return data.result as ExpenseStat | null;
    return null;
}

export function useTotalExpense() {
    return useQuery({
        queryKey: ["total-expense"],
        queryFn: getTotalExpense,
        staleTime: 5 * 60 * 1000,
    });
}
