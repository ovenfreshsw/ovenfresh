import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
    QueryFunction,
} from "@tanstack/react-query";
import React from "react";

const ServerWrapper = async ({
    children,
    queryFn,
    queryKey,
}: {
    children: React.ReactNode;
    queryFn: QueryFunction<unknown, (string | number)[], never> | undefined;
    queryKey: (string | number)[];
}) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
};

export default ServerWrapper;
