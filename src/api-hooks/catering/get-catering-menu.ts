import axios from "@/config/axios.config";
import { CateringMenuDocument } from "@/models/types/catering-menu";
import { useQuery } from "@tanstack/react-query";

export async function getCateringMenu() {
    const { data } = await axios.get("/api/menu/catering");
    if (data && data.result)
        return data.result as CateringMenuDocument[] | null;
    return null;
}

export function useCateringMenu() {
    return useQuery({
        queryKey: ["menu", "catering"],
        queryFn: getCateringMenu,
    });
}
