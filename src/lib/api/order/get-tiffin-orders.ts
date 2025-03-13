import axios from "@/config/axios.config";
import { TiffinDocument } from "@/models/types/tiffin";
import { headers } from "next/headers";

export async function getTiffinOrdersServer(limit?: number) {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/order/tiffin", {
        params: {
            limit,
        },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.orders as TiffinDocument[] | null;
}
