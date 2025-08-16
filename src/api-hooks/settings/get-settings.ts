import axios from "@/config/axios.config";
import { SettingsDocument } from "@/models/types/setting";
import { useQuery } from "@tanstack/react-query";

async function getSettings(store: string) {
    const { data } = await axios.get("/api/settings?store=" + store);
    if (data && data.settings) return data.settings as SettingsDocument | null;
    return null;
}

export function useSettings(store: string) {
    return useQuery({
        queryKey: ["settings", store],
        queryFn: () => getSettings(store),
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
