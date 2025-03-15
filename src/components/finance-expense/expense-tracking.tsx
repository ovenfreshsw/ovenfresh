import { Suspense } from "react";
import ServerWrapper from "./server-wrapper";
import { getTotalExpenseServer } from "@/lib/api/finance/get-total-expense";
import TotalExpense from "./total-expense";
import ExpenseStatCardSkeleton from "../skeleton/expense-stat-card-skeleton";
import ExpenseDetails from "./expense-details";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { getExpenseDetailsServer } from "@/lib/api/finance/get-expense-details-server";
import ProfitDetails from "./expense-monthly-trend";
import ExpenseMonthlyTrend from "./expense-monthly-trend";
import { getMonthlyTrendServer } from "@/lib/api/finance/get-monthly-trend-server";
import CardSkeleton from "../skeleton/card-skeleton";

const ExpenseTracking = () => {
    return (
        <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Suspense
                    fallback={
                        <>
                            <ExpenseStatCardSkeleton />
                            <ExpenseStatCardSkeleton />
                            <ExpenseStatCardSkeleton />
                        </>
                    }
                >
                    <ServerWrapper
                        queryFn={getTotalExpenseServer}
                        queryKey={["total-expense"]}
                    >
                        <TotalExpense />
                    </ServerWrapper>
                </Suspense>
            </div>

            <Suspense fallback={<CardSkeleton />}>
                <ServerWrapper
                    queryFn={getExpenseDetailsServer}
                    queryKey={[
                        "expense-details",
                        format(new Date(), "MMM").toLowerCase(),
                    ]}
                >
                    <ExpenseDetails />
                </ServerWrapper>
            </Suspense>

            <Suspense fallback={<CardSkeleton className="mt-7" />}>
                <ServerWrapper
                    queryFn={getMonthlyTrendServer}
                    queryKey={["monthly-trend"]}
                >
                    <ExpenseMonthlyTrend />
                </ServerWrapper>
            </Suspense>
        </div>
    );
};

export default ExpenseTracking;
