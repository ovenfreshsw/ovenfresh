"use client";

import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { format } from "date-fns";
import MonthSelect from "../select/month-select";
import { useState } from "react";
import { useProfitDetails } from "@/api-hooks/admin/get-profit-details";
import { getMonthInNumber } from "@/lib/utils";
import CardSkeleton from "../skeleton/card-skeleton";

const ProfitMetrics = () => {
    const [monthFilter, setMonthFilter] = useState(
        format(new Date(), "MMM").toLowerCase()
    );
    const {
        data: profitDetails,
        isPending,
        isError,
    } = useProfitDetails(monthFilter);

    const totalRevenue = profitDetails?.reduce(
        (sum, data) => sum + data.totalRevenue,
        0
    );
    const totalExpense = profitDetails?.reduce(
        (sum, data) => sum + data.totalExpense,
        0
    );
    const totalProfit = profitDetails?.reduce(
        (sum, data) => sum + data.totalProfit,
        0
    );

    if (isPending) return <CardSkeleton className="mt-7 min-h-[520px]" />;
    if (isError)
        return (
            <div className="text-center min-h-[520px] bg-white rounded-lg shadow border mt-7">
                Error: Unable to fetch data
            </div>
        );
    if (!profitDetails)
        return (
            <div className="text-center min-h-[520px] bg-white rounded-lg shadow border mt-7">
                No data found
            </div>
        );

    return (
        <div className="p-6 rounded-lg bg-white shadow border space-y-6 min-h-[520px]">
            <div>
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-semibold">Profit Details</h1>
                    <MonthSelect
                        monthFilter={monthFilter}
                        setMonthFilter={setMonthFilter}
                        removeAllMonth
                    />
                </div>
                <p className="text-muted-foreground text-sm">
                    Monthly profit by store
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${totalRevenue}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            For{" "}
                            {format(
                                new Date(
                                    2025,
                                    getMonthInNumber(monthFilter) - 1,
                                    1
                                ),
                                "MMMM"
                            )}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Expense
                        </CardTitle>
                        <TrendingDown className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalExpense}</div>
                        <p className="text-xs text-muted-foreground">
                            For March
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Profit
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProfit}</div>
                        <p className="text-xs text-muted-foreground">
                            For March
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Store Details Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Store Performance</CardTitle>
                    <CardDescription>
                        Detailed breakdown by store for March
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Store</TableHead>
                                    <TableHead className="text-right">
                                        Revenue
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Expense
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Profit
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {profitDetails.map((data) => (
                                    <TableRow key={data.store}>
                                        <TableCell className="font-medium">
                                            {data.store}
                                        </TableCell>
                                        <TableCell className="text-right text-emerald-600">
                                            ${data.totalRevenue}
                                        </TableCell>
                                        <TableCell className="text-right text-rose-600">
                                            ${data.totalExpense}
                                        </TableCell>
                                        <TableCell className="text-right text-indigo-600">
                                            ${data.totalProfit}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfitMetrics;
