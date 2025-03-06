import axios from "@/config/axios.config";
import { StoreDocument } from "@/models/types/store";
import { headers } from "next/headers";

export async function getStoresServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/store", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.stores as StoreDocument[] | null;
}
