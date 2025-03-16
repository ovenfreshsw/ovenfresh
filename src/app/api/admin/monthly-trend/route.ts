import { error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import {
    getMonthInNumber,
    getMonthsUpToCurrent,
    isRestricted,
} from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Grocery from "@/models/groceryModel";
import Store from "@/models/storeModel";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN"])) return error403();

        // Get all stores with their locations
        const stores = await Store.find({}, "_id location");
        const storeMap = new Map(
            stores.map((store) => [store._id.toString(), store.location])
        );
        const storesLocation = stores.map((store) => store.location);

        // Get last 3 months
        const months = getMonthsUpToCurrent(true); // Example: [{ value: "jan", name: "January 2025" }, ...]

        const expensesData: Record<
            string,
            {
                month: string;
                expenses: Record<string, { total: number; items: number }>;
            }
        > = {};
        months.forEach(({ value, name }) => {
            expensesData[value] = { month: name, expenses: {} };
        });

        // Create a date filter range using month-to-number conversion
        const currentYear = new Date().getFullYear();
        const startMonth = getMonthInNumber(months[0].value); // Convert "jan" -> 1, etc.
        const startDate = new Date(currentYear, startMonth - 1, 1); // YYYY-MM-01

        // Fetch grocery data
        const groceries = await Grocery.find(
            { date: { $gte: startDate } }, // Filter from the earliest month
            { store: 1, total: 1, date: 1 }
        ).lean();

        // Process data manually
        groceries.forEach((grocery) => {
            const groceryDate = new Date(grocery.date);
            const monthNumber = groceryDate.getMonth() + 1; // Get month as number (1-12)
            const monthKey = Object.keys(expensesData).find(
                (key) => getMonthInNumber(key) === monthNumber
            );

            const storeLocation = storeMap.get(grocery.store.toString()); // Convert store ID to location name

            if (monthKey && expensesData[monthKey] && storeLocation) {
                if (!expensesData[monthKey].expenses[storeLocation]) {
                    expensesData[monthKey].expenses[storeLocation] = {
                        total: 0,
                        items: 0,
                    };
                }
                expensesData[monthKey].expenses[storeLocation].total +=
                    grocery.total;
                expensesData[monthKey].expenses[storeLocation].items += 1;
            }
        });

        const result = {
            expensesData: Object.values(expensesData),
            stores: storesLocation,
        };

        return success200({ result });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred" });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
