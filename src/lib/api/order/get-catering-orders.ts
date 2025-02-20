import axios from "@/config/axios.config";
import { CateringDocument } from "@/models/types/catering";
import { headers } from "next/headers";

export async function getCateringOrdersServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/order/catering", {
        params: {
            storeId: "676cee708588c68c668d3aa7",
        },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.orders as CateringDocument[] | null;
}
