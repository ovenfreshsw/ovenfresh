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
                        },
                    },
                    {
                        $match: {
                            month: monthNumber,
                            store: store._id,
                        },
                    },
                ]),
                await Catering.aggregate([
                    {
                        $project: {
                            totalPrice: 1,
                            store: 1,
                            month: { $month: "$createdAt" },
                        },
                    },
                    { $match: { month: monthNumber, store: store._id } },
                ]),
                await Grocery.aggregate([
                    {
                        $project: {
                            total: 1,
                            store: 1,
                            month: { $month: "$date" },
                        },
                    },
                    { $match: { month: monthNumber, store: store._id } },
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
                totalRevenue: (tiffinSum + cateringSum).toFixed(2),
                totalExpense: grocerySum.toFixed(2),
                totalProfit: (tiffinSum + cateringSum - grocerySum).toFixed(2),
            };
        });

        // Ensure all promises in queryPromise are resolved
        const result = await Promise.all(queryPromise);

        return success200({ result });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred" });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
