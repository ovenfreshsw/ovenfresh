import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ServerWrapper from "./server-wrapper";
import { Suspense } from "react";
import { getTotalRevenueServer } from "@/lib/api/finance/get-total-revenue";
import RevenueStatCardSkeleton from "../skeleton/revenue-stat-card-skeleton";
import TotalRevenue from "./total-revenue";
import StoresRevenue from "./stores-revenue";
import { getStoresRevenueServer } from "@/lib/api/finance/get-stores-revenue";

interface RevenueMetricsProps {
    detailed?: boolean;
}

export function RevenueMetrics({ detailed = false }: RevenueMetricsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<RevenueStatCardSkeleton />}>
                <ServerWrapper
                    queryFn={getTotalRevenueServer}
                    queryKey={["total-revenue"]}
                >
                    <TotalRevenue />
                </ServerWrapper>
            </Suspense>
            <Suspense
                fallback={
                    <>
                        <RevenueStatCardSkeleton />
                        <RevenueStatCardSkeleton />
                    </>
                }
            >
                <ServerWrapper
                    queryFn={getStoresRevenueServer}
                    queryKey={["stores-revenue"]}
                >
                    <StoresRevenue />
                </ServerWrapper>
            </Suspense>

            {detailed && (
                <>
                    <Card className="md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Catering Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$12,000</div>
                            <p className="text-xs text-muted-foreground">
                                +22.5% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Revenue Breakdown</CardTitle>
                            <CardDescription>
                                Monthly revenue by category
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Current Month</TableHead>
                                        <TableHead>Previous Month</TableHead>
                                        <TableHead className="text-right">
                                            Change
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Store 1
                                        </TableCell>
                                        <TableCell>$58,250</TableCell>
                                        <TableCell>$53,850</TableCell>
                                        <TableCell className="text-right text-green-600">
                                            +8.2%
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Store 2
                                        </TableCell>
                                        <TableCell>$42,800</TableCell>
                                        <TableCell>$40,600</TableCell>
                                        <TableCell className="text-right text-green-600">
                                            +5.4%
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Tiffin Service
                                        </TableCell>
                                        <TableCell>$15,400</TableCell>
                                        <TableCell>$13,030</TableCell>
                                        <TableCell className="text-right text-green-600">
                                            +18.2%
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Catering
                                        </TableCell>
                                        <TableCell>$12,000</TableCell>
                                        <TableCell>$9,800</TableCell>
                                        <TableCell className="text-right text-green-600">
                                            +22.5%
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
