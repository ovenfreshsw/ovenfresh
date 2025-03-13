import axios from "@/config/axios.config";
import { CateringCategoryDocument } from "@/models/types/catering-category";
import { headers } from "next/headers";

export async function getCateringCategoryServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/menu/category", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.categories as CateringCategoryDocument[] | null;
}
