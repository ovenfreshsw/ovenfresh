import axios from "@/config/axios.config";
import { TiffinMenuDocument } from "@/models/types/tiffin-menu";
import { useQuery } from "@tanstack/react-query";

async function getTiffinMenu() {
    const { data } = await axios.get("/api/menu/tiffin");
    if (data && data.result) return data.result as TiffinMenuDocument | null;
    return null;
}

export function useTiffinMenu() {
    return useQuery({
        queryKey: ["menu", "tiffin"],
        queryFn: getTiffinMenu,
    });
}
