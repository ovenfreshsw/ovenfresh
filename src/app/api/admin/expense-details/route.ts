import { error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { getMonthInNumber, isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Grocery from "@/models/groceryModel";
import { format } from "date-fns";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN"])) return error403();
        const month =
            req.nextUrl.searchParams.get("month") ||
            format(new Date(), "MMM").toLowerCase();
        const monthNumber = getMonthInNumber(month);

        const groceries = await Grocery.aggregate([
            {
                $lookup: {
                    from: "stores",
                    localField: "store",
                    foreignField: "_id",
                    as: "store",
                },
            },
            {
                $project: {
                    _id: 1,
                    store: "$store.location",
                    item: 1,
                    quantity: 1,
                    price: 1,
                    tax: 1,
                    total: 1,
                    unit: 1,
                    date: 1,
                    month: { $month: "$date" },
                },
            },
            { $match: { month: monthNumber } },
        ]);

        const result = groceries.map((grocery) => ({
            _id: grocery._id,
            store: grocery.store[0],
            item: grocery.item,
            quantity: grocery.quantity,
            price: grocery.price,
            tax: grocery.tax,
            total: grocery.total,
            unit: grocery.unit,
            date: grocery.date,
        }));

        return success200({ result });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred" });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
