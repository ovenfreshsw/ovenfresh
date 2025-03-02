import { getTiffinOrdersServer } from "@/lib/api/order/get-tiffin-orders";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import React from "react";

const TiffinServerWrapper = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
    });
    await queryClient.prefetchQuery({
        queryKey: ["order", "tiffin"],
        queryFn: () => getTiffinOrdersServer(10),
    });
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
};

export default TiffinServerWrapper;
