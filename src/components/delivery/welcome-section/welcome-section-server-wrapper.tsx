import { getDeliveryOrderStatsServer } from "@/lib/api/order/get-delivery-order-stats";
import { authOptions } from "@/lib/auth";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import React from "react";

const WelcomeSectionServerWrapper = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["delivery", "stats", "tiffin"],
        queryFn: () => getDeliveryOrderStatsServer("tiffin"),
        staleTime: 5 * 60 * 1000,
    });
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
};

export default WelcomeSectionServerWrapper;
