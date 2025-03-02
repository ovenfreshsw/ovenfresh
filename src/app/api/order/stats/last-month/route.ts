import { authOptions } from "@/lib/auth";
import { error400, error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Catering from "@/models/cateringModel";
import Tiffin from "@/models/tiffinModel";
import { getServerSession } from "next-auth";
import { fetchOrderStats } from "./helper";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();

        const modelType = req.nextUrl.searchParams.get("model");
        if (!modelType) return error400("Model type is required!");

        const session = await getServerSession(authOptions);
        const storeId = session?.user?.storeId;

        if (!storeId) return error403();

        const model = modelType === "tiffin" ? Tiffin : Catering;

        const orderStat = await fetchOrderStats(model, storeId);

        return success200({
            result: {
                data: orderStat.last30DaysCounts,
                trend: orderStat.trend,
                percentage:
                    orderStat.trend === "up"
                        ? `+${orderStat.percentageChange}%`
                        : `${
                              Number(orderStat.percentageChange || 0) > 0
                                  ? "-"
                                  : ""
                          }${orderStat.percentageChange}%`,
                title: `${modelType} Orders`,
                value: orderStat.totalLast30Days.toString(),
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        } else {
            return error500({ error: "An unknown error occurred" });
        }
    }
}

export const GET = withDbConnectAndAuth(getHandler);
