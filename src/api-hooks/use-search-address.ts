import axios from "@/config/axios.config";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { useQuery } from "@tanstack/react-query";

async function getSearchResult(
    query: string,
    key: number,
    signal: AbortSignal
) {
    if (query.length < 3 || key === 0) return [];
    const { data } = await axios.get("/api/address/search", {
        params: { address: query },
        signal,
    });
    if (data && data.result)
        return data.result as PlaceAutocompleteResult[] | undefined;
    return null;
}

export function useSearchAddress({
    address,
    key,
}: {
    address: string;
    key: number;
}) {
    return useQuery({
        queryKey: ["address", "search", address],
        queryFn: ({ signal }) => getSearchResult(address, key, signal),
        retry: false,
        staleTime: Infinity,
    });
}
