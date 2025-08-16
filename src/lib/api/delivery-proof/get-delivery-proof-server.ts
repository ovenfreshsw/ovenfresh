import axios from "@/config/axios.config";
import { DeliveryProof } from "@/lib/types/delivery";
import { headers } from "next/headers";

export async function getDeliveryProofServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/admin/delivery-proof", {
        params: {
            page: 1,
        },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (data && data.proofs) return data.proofs as DeliveryProof[] | null;
}
