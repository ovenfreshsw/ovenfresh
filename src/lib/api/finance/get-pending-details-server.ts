import axios from "@/config/axios.config";
import { PendingDetailsProps } from "@/lib/types/finance";
import { headers } from "next/headers";

export async function getPendingDetailsServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/admin/pending-details", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.result as PendingDetailsProps[] | null;
}
