import axios from "@/config/axios.config";
import {
    ScheduledCateringDelivery,
    ScheduledTiffinDelivery,
} from "@/lib/types/scheduled-order";
import { headers } from "next/headers";

export async function getDeliveryOrdersServer(
    orderType: "tiffins" | "caterings"
) {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get(
        `/api/order/scheduled/delivery/${orderType}`,
        {
            headers: {
                Cookie: `${cookie}`,
            },
        }
    );

    if (orderType === "tiffins") {
        return data.data as ScheduledTiffinDelivery | null;
    } else {
        return data.data as ScheduledCateringDelivery | null;
    }
}
