import axios from "@/config/axios.config";
import { GroceryDocument } from "@/models/types/grocery";
import { headers } from "next/headers";

export async function getGroceriesServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/groceries", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.groceries as GroceryDocument[] | null;
}
