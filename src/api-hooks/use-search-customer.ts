import axios from "@/config/axios.config";
import { CustomerSearchResult } from "@/lib/types/customer";
import { useQuery } from "@tanstack/react-query";

async function getSearchResult(query: string) {
    if (!query) return null;
    const { data } = await axios.get("/api/customer/search", {
        params: { phone: query },
    });
    if (data && data.result)
        return data.result as CustomerSearchResult[] | null;
    return null;
}

export function useSearchCustomer(search: string) {
    return useQuery({
        queryKey: ["customer", "search", search],
        queryFn: () => getSearchResult(search),
        retry: false,
    });
}
