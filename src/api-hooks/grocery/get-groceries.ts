import axios from "@/config/axios.config";
import { GroceryDocument } from "@/models/types/grocery";
import { useQuery } from "@tanstack/react-query";

async function getGroceries() {
    const { data } = await axios.get("/api/groceries");
    if (data && data.groceries)
        return data.groceries as GroceryDocument[] | null;
    return null;
}

export function useGroceries() {
    return useQuery({
        queryKey: ["groceries"],
        queryFn: getGroceries,
    });
}
