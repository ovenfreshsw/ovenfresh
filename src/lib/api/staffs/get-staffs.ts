import axios from "@/config/axios.config";
import { UserDocumentPopulate } from "@/models/types/user";
import { headers } from "next/headers";

export async function getStaffsServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/staffs", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.staffs as UserDocumentPopulate[] | null;
}
