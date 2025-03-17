import { error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { getMonthInNumber, isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Catering from "@/models/cateringModel";
import Grocery from "@/models/groceryModel";
import Store from "@/models/storeModel";
import Tiffin from "@/models/tiffinModel";
import { format } from "date-fns";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN"])) return error403();
        const month =
            req.nextUrl.searchParams.get("month") ||
            format(new Date(), "MMM").toLowerCase();
        const year =
            req.nextUrl.searchParams.get("year") || format(new Date(), "yyyy");

        const monthNumber = getMonthInNumber(month);

        const stores = await Store.find({}, "_id location");

        const queryPromise = stores.map(async (store) => {
            const [tiffinTotal, cateringTotal, expense] = await Promise.all([
                await Tiffin.aggregate([
                    {
                        $project: {
                            totalPrice: 1,
                            store: 1,
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" },
                        },
                    },
                    {
                        $match: {
                            month: monthNumber,
                            store: store._id,
                            year: Number(year),
                        },
                    },
                ]),
                await Catering.aggregate([
                    {
                        $project: {
                            totalPrice: 1,
                            store: 1,
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" },
                        },
                    },
                    {
                        $match: {
                            month: monthNumber,
                            store: store._id,
                            year: Number(year),
                        },
                    },
                ]),
                await Grocery.aggregate([
                    {
                        $project: {
                            total: 1,
                            store: 1,
                            month: { $month: "$date" },
                            year: { $year: "$date" },
                        },
                    },
                    {
                        $match: {
                            month: monthNumber,
                            store: store._id,
                            year: Number(year),
                        },
                    },
                ]),
            ]);

            const tiffinSum = tiffinTotal.reduce(
                (sum, tiffin) => sum + tiffin.totalPrice,
                0
            );
            const cateringSum = cateringTotal.reduce(
                (sum, catering) => sum + catering.totalPrice,
                0
            );
            const grocerySum = expense.reduce(
                (sum, grocery) => sum + grocery.total,
                0
            );

            return {
                store: store.location,
                totalRevenue: tiffinSum + cateringSum,
                totalExpense: grocerySum,
                totalProfit: tiffinSum + cateringSum - grocerySum,
            };
        });

        // Ensure all promises in queryPromise are resolved
        const result = await Promise.all(queryPromise);

        return success200({ result });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred" });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
