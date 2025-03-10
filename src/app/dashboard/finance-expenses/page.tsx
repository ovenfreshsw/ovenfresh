import Header from "@/components/dashboard/header";
import { Box, Stack, Typography } from "@mui/material";
import React, { Suspense } from "react";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getStaffsServer } from "@/lib/api/staffs/get-staffs";
import StaffsTable from "@/components/data-table/staffs-table";
import { getStoresServer } from "@/lib/api/stores/get-stores";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevenueMetrics } from "@/components/finance-expense/revenue-metrics";
import { RevenueExpenseCharts } from "@/components/charts/revenue-expense-chart";
import ServerWrapper from "@/components/finance-expense/server-wrapper";
import { getRevenueExpenseAnalysisServer } from "@/lib/api/finance/get-revenue-expense-analysis";

const FinanceAndExpensesPage = async () => {
    // const queryClient = new QueryClient({
    //     defaultOptions: { queries: { staleTime: Infinity } },
    // });
    // await Promise.all([
    //     queryClient.prefetchQuery({
    //         queryKey: ["staffs"],
    //         queryFn: getStaffsServer,
    //     }),
    //     queryClient.prefetchQuery({
    //         queryKey: ["stores"],
    //         queryFn: getStoresServer,
    //     }),
    // ]);
    return (
        <Box component="main" className="flex-grow overflow-auto">
            <Header />
            <Stack
                spacing={2}
                sx={{
                    alignItems: "center",
                    mx: 3,
                    pb: 5,
                    pt: { xs: 2, md: 0 },
                    mt: { xs: 8, md: 2 },
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                        Finance & Expenses
                    </Typography>
                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="revenue">Revenue</TabsTrigger>
                            <TabsTrigger value="pending">
                                Pending Payments
                            </TabsTrigger>
                            <TabsTrigger value="expenses">Expenses</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <RevenueMetrics />
                            <Suspense fallback={<div>Loading...</div>}>
                                <ServerWrapper
                                    queryFn={getRevenueExpenseAnalysisServer}
                                    queryKey={["rne-analysis"]}
                                >
                                    <RevenueExpenseCharts />
                                </ServerWrapper>
                            </Suspense>
                        </TabsContent>

                        <TabsContent value="revenue" className="space-y-4">
                            {/* <RevenueMetrics detailed /> */}
                        </TabsContent>

                        <TabsContent value="pending" className="space-y-4">
                            {/* <PendingPayments /> */}
                        </TabsContent>

                        <TabsContent value="expenses" className="space-y-4">
                            {/* <ExpenseTracking /> */}
                        </TabsContent>
                    </Tabs>
                    {/* <HydrationBoundary state={dehydrate(queryClient)}>
                      <StaffsTable />
                  </HydrationBoundary> */}
                </Box>
            </Stack>
        </Box>
    );
};

export default FinanceAndExpensesPage;
