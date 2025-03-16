import Header from "@/components/dashboard/header";
import { Box, Stack, Typography } from "@mui/material";
import React, { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevenueMetrics } from "@/components/finance-expense/revenue-metrics";
import { RevenueExpenseCharts } from "@/components/charts/revenue-expense-chart";
import { getRevenueExpenseAnalysisServer } from "@/lib/api/finance/get-revenue-expense-analysis";
import PendingPayments from "@/components/finance-expense/pending-payment";
import ExpenseTracking from "@/components/finance-expense/expense-tracking";
import ProfitMetrics from "@/components/finance-expense/profit-metrics";
import { format } from "date-fns";
import { getProfitDetailsServer } from "@/lib/api/finance/get-profit-details-server";
import ServerWrapper from "@/components/server-wrapper";

const FinanceAndExpensesPage = async () => {
    return (
        <Box component="main" className="flex-grow overflow-auto">
            <Header />
            <Stack
                spacing={2}
                sx={{
                    alignItems: "center",
                    mx: { xs: 1.5, md: 3 },
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
                        <TabsList className="max-w-full justify-start overflow-x-scroll scrollbar-hide">
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
                            <Suspense fallback={<div>Loading...</div>}>
                                <ServerWrapper
                                    queryFn={getProfitDetailsServer}
                                    queryKey={[
                                        "profit-details",
                                        format(new Date(), "MMM").toLowerCase(),
                                    ]}
                                >
                                    <ProfitMetrics />
                                </ServerWrapper>
                            </Suspense>
                        </TabsContent>

                        <TabsContent value="revenue" className="space-y-4">
                            <RevenueMetrics detailed />
                        </TabsContent>

                        <TabsContent value="pending" className="space-y-4">
                            <PendingPayments />
                        </TabsContent>

                        <TabsContent value="expenses" className="space-y-4">
                            <ExpenseTracking />
                        </TabsContent>
                    </Tabs>
                </Box>
            </Stack>
        </Box>
    );
};

export default FinanceAndExpensesPage;
