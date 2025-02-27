import axios from "@/config/axios.config";
import { TiffinDocument } from "@/models/types/tiffin";
import { headers } from "next/headers";

export async function getTiffinOrdersServer(limit?: number) {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/order/tiffin", {
        params: {
            storeId: "676cee708588c68c668d3aa7",
            limit,
        },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.orders as TiffinDocument[] | null;
}
