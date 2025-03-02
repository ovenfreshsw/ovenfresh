import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import StatCard from "./stat-card";
import { getLastMonthStatsServer } from "@/lib/api/order/get-last-month-stats";

const StatCardWrapper = async ({ type }: { type: "tiffin" | "catering" }) => {
    // const orderStat = await fetchOrderStats(model);
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
    });
    await queryClient.prefetchQuery({
        queryKey: ["order", "stats", "last-month", type],
        queryFn: () => getLastMonthStatsServer(type),
    });
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <StatCard type={type} />
        </HydrationBoundary>
    );
};

export default StatCardWrapper;
