import axios from "@/config/axios.config";
import { ScheduledOrderProps } from "@/lib/types/scheduled-order";
import { format } from "date-fns";
import { headers } from "next/headers";

export async function getScheduledOrdersServer(date: Date, storeId: string) {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/order/scheduled", {
        params: {
            storeId,
            date: format(date, "yyyy-MM-dd"),
        },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.orders as ScheduledOrderProps[] | null;
}
