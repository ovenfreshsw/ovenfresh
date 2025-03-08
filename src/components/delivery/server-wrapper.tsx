import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";

type ServerWrapperProps = {
    children: React.ReactNode;
    queryKey: string[];
    queryFn: () => Promise<any>;
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
