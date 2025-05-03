"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import MonthSelect from "../select/month-select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { useState } from "react";
import { format } from "date-fns";
import { useExpenseDetails } from "@/api-hooks/admin/get-expense-details";
import { ExpenseDetailsProps } from "@/lib/types/finance";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const ExpenseDetails = () => {
    const [monthFilter, setMonthFilter] = useState(
        format(new Date(), "MMM").toLowerCase()
    );
    const yearFilter = useSelector((state: RootState) => state.selectYear);
    const [searchQuery, setSearchQuery] = useState("");
    const { data: expenseDetails, isPending } = useExpenseDetails(
        monthFilter,
        yearFilter
    );

    // Filter items based on search query and selected store
    const getFilteredItems = () => {
        const allItems: ExpenseDetailsProps[] = expenseDetails || [];

        // Apply search filter
        if (searchQuery) {
            return allItems.filter((item) =>
                item.item.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return allItems;
    };

    const filteredItems = getFilteredItems();

    if (isPending) {
        return (
            <div className="flex justify-center items-center gap-1 min-h-[420px] bg-white rounded-lg shadow">
                <Loader2 className="animate-spin" />
                Loading...
            </div>
        );
    }

    return (
        <Card className="mt-7">
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="text-lg">
                            Grocery Expense Details
                        </CardTitle>
                        <CardDescription>
                            Itemized grocery expenses for {monthFilter} 2025
                        </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <Input
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-[200px]"
                        />
                        <MonthSelect
                            monthFilter={monthFilter}
                            setMonthFilter={setMonthFilter}
                            removeAllMonth={true}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Store</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Purchased from</TableHead>
                            <TableHead className="whitespace-nowrap">
                                Unit Price &#040;$&#041;
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                                Tax &#040;$&#041;
                            </TableHead>
                            <TableHead className="text-right whitespace-nowrap">
                                Total &#040;$&#041;
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <TableRow key={`${item.store}-${item._id}`}>
                                    <TableCell className="font-medium whitespace-nowrap">
                                        {format(new Date(item.date), "MMM d")}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {item.item}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {item.store}
                                    </TableCell>
                                    <TableCell>
                                        {item.quantity}{" "}
                                        {item.unit === "none" ? "" : item.unit}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {item.purchasedFrom}
                                    </TableCell>
                                    <TableCell>
                                        {item.price > 0
                                            ? item.price
                                            : "Variable"}
                                    </TableCell>
                                    <TableCell>{item.tax}</TableCell>
                                    <TableCell className="text-right">
                                        ${item.total.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center py-4"
                                >
                                    No items found
                                </TableCell>
                            </TableRow>
                        )}

                        {filteredItems.length > 0 && (
                            <TableRow className="bg-muted/50">
                                <TableCell
                                    colSpan={6}
                                    className="font-medium text-right"
                                >
                                    Total:
                                </TableCell>
                                <TableCell className="text-right font-bold">
                                    $
                                    {filteredItems
                                        .reduce(
                                            (sum, item) => sum + item.total,
                                            0
                                        )
                                        .toLocaleString()}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default ExpenseDetails;
