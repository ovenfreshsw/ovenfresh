import axios from "@/config/axios.config";
import { CateringMenuDocumentPopulate } from "@/models/types/catering-menu";
import { useQuery } from "@tanstack/react-query";

export async function getCateringMenu(disabled?: "true" | "false") {
    const { data } = await axios.get("/api/menu/catering", {
        params: {
            disabled,
        },
    });

    if (data && data.result)
        return data.result as CateringMenuDocumentPopulate[] | null;
    return null;
}

export function useCateringMenu(disabled?: "true" | "false") {
    return useQuery({
        queryKey: ["menu", "catering"],
        queryFn: () => getCateringMenu(disabled),
    });
}
