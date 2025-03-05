import { getCateringOrdersServer } from "@/lib/api/order/get-catering-orders";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import React from "react";

const CateringServerWrapper = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
    });
    await queryClient.prefetchQuery({
        queryKey: ["order", "catering"],
        queryFn: () => getCateringOrdersServer(10),
    });
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
};

export default CateringServerWrapper;
