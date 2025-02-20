import axios from "@/config/axios.config";
import { CateringMenuDocument } from "@/models/types/catering-menu";
import { headers } from "next/headers";

export async function getCateringMenuServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/menu/catering", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.result as CateringMenuDocument[] | null;
}
