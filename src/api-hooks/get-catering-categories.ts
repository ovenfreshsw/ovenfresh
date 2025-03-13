import axios from "@/config/axios.config";
import { CateringCategoryDocument } from "@/models/types/catering-category";
import { useQuery } from "@tanstack/react-query";

async function getCategories() {
    const { data } = await axios.get("/api/menu/category");
    if (data && data.categories)
        return data.categories as CateringCategoryDocument[] | null;
    return null;
}

export function useCategories() {
    return useQuery({
        queryKey: ["menu", "category"],
        queryFn: getCategories,
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
