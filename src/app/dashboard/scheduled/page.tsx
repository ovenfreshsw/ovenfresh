import Header from "@/components/dashboard/header";
import ScheduledOrders from "@/components/scheduled-orders/scheduled-orders";
import { getScheduledOrdersServer } from "@/lib/api/order/get-scheduled-orders";
import { authOptions } from "@/lib/auth";
import { Box, Stack } from "@mui/material";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import React from "react";

const ScheduledPage = async () => {
    const session = await getServerSession(authOptions);
    const storeId = session?.user?.storeId;

    if (!storeId) {
        throw new Error("Store ID not found!");
    }

    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
    });
    await queryClient.prefetchQuery({
        queryKey: [
            "order",
            "scheduled",
            storeId,
            format(new Date(), "yyyy-MM-dd"),
        ],
        queryFn: () => getScheduledOrdersServer(new Date(), storeId),
    });

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                overflow: "auto",
                // position: "relative",
            }}
        >
            <Header />
            <Stack
                spacing={2}
                sx={{
                    mx: { xs: 1.5, md: 3 },
                    pb: 5,
                    pt: { xs: 2, md: 0 },
                    mt: { xs: 8, md: 2 },
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: { sm: "100%", md: "1700px" },
                    }}
                >
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <ScheduledOrders storeId={storeId} />
                    </HydrationBoundary>
                </Box>
            </Stack>
        </Box>
    );
};

export default ScheduledPage;
