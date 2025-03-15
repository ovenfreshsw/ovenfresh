import ServerWrapper from "./server-wrapper";
import { Suspense } from "react";
import { getTotalRevenueServer } from "@/lib/api/finance/get-total-revenue";
import RevenueStatCardSkeleton from "../skeleton/revenue-stat-card-skeleton";
import TotalRevenue from "./total-revenue";
import StoresRevenue from "./stores-revenue";
import { getStoresRevenueServer } from "@/lib/api/finance/get-stores-revenue";
import RevenueBreakdown from "./revenue-breakdown";
import { getRevenueBreakdownServer } from "@/lib/api/finance/get-revenue-breakdown-server";
import { format } from "date-fns";

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
                <Suspense fallback={<div>Loading...</div>}>
                    <ServerWrapper
                        queryFn={getRevenueBreakdownServer}
                        queryKey={[
                            "revenue-breakdown",
                            format(new Date(), "MMM").toLowerCase(),
                        ]}
                    >
                        <RevenueBreakdown />
                    </ServerWrapper>
                </Suspense>
            )}
        </div>
    );
}
