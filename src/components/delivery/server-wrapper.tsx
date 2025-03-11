import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
    QueryFunction,
} from "@tanstack/react-query";

type ServerWrapperProps = {
    children: React.ReactNode;
    queryKey: string[];
    queryFn: QueryFunction<unknown, string[], never> | undefined;
};

const ServerWrapper = async ({
    children,
    queryKey,
    queryFn,
}: ServerWrapperProps) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: 5 * 60 * 1000,
    });
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
};

export default ServerWrapper;
