import Store from "@/models/storeModel";
import Tiffin from "@/models/tiffinModel";
import { addDays, format } from "date-fns";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response("Unauthorized", {
                status: 401,
            });
        }

        console.log("Cron triggered");

        const today = new Date(format(new Date(), "yyyy-MM-dd"));
        const endingDate = new Date(format(addDays(today, 2), "yyyy-MM-dd"));

        const expiringTiffins = await Tiffin.find(
            { endDate: endingDate },
            "customerPhone customerName orderId endDate"
        ).populate({
            path: "store",
            model: Store,
            select: "location name phone address",
        });

        if (expiringTiffins.length === 0) {
            return Response.json({ success: true });
        }
        // TODO: Implement cron logic: Sent whatsapp message from here.

        return Response.json({ success: true });
    } catch (error) {
        console.log("Error in cron route", error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
