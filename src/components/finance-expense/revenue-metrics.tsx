import { Suspense } from "react";
import { getTotalRevenueServer } from "@/lib/api/finance/get-total-revenue";
import RevenueStatCardSkeleton from "../skeleton/revenue-stat-card-skeleton";
import TotalRevenue from "./total-revenue";
import StoresRevenue from "./stores-revenue";
import { getStoresRevenueServer } from "@/lib/api/finance/get-stores-revenue";
import RevenueBreakdown from "./revenue-breakdown";
import { getRevenueBreakdownServer } from "@/lib/api/finance/get-revenue-breakdown-server";
import { format } from "date-fns";
import ServerWrapper from "../server-wrapper";

interface RevenueMetricsProps {
    detailed?: boolean;
}

export function RevenueMetrics({ detailed = false }: RevenueMetricsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<RevenueStatCardSkeleton />}>
                <ServerWrapper
                    queryFn={getTotalRevenueServer}
                    queryKey={[
                        "revenue",
                        "total-revenue",
                        format(new Date(), "yyyy"),
                    ]}
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
                    queryKey={[
                        "revenue",
                        "stores-revenue",
                        format(new Date(), "yyyy"),
                    ]}
                >
                    <StoresRevenue />
                </ServerWrapper>
            </Suspense>

            {detailed && (
                <Suspense fallback={<div>Loading...</div>}>
                    <ServerWrapper
                        queryFn={getRevenueBreakdownServer}
                        queryKey={[
                            "revenue",
                            "revenue-breakdown",
                            format(new Date(), "yyyy"),
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
