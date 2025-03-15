import axios from "@/config/axios.config";
import { DeliveryProof } from "@/lib/types/delivery";
import { headers } from "next/headers";

export async function getDeliveryProofServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/admin/delivery-proof", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.result as DeliveryProof[] | null;
}
