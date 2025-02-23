import Header from "@/components/dashboard/header";
import { Box, Divider, Stack } from "@mui/material";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TiffinOrders from "@/components/tiffin/tiffin-orders";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getTiffinOrdersServer } from "@/lib/api/order/get-tiffin-orders";
import { getCateringOrdersServer } from "@/lib/api/order/get-catering-orders";
import CateringOrders from "@/components/catering/catering-orders";

const Orders = async () => {
    const queryClient = new QueryClient();
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ["order", "tiffin"],
            queryFn: getTiffinOrdersServer,
        }),
        queryClient.prefetchQuery({
            queryKey: ["order", "catering"],
            queryFn: getCateringOrdersServer,
        }),
    ]);

    return (
        <Box component="main" className="flex-grow overflow-auto">
            <Header />
            <Stack
                spacing={2}
                sx={{
                    alignItems: "center",
                    mx: 3,
                    pb: 5,
                    mt: { xs: 8, md: 2 },
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Tabs defaultValue="tiffin">
                        <TabsList>
                            <TabsTrigger value="tiffin">
                                Tiffin Orders
                            </TabsTrigger>
                            <TabsTrigger value="catering">
                                Catering Orders
                            </TabsTrigger>
                        </TabsList>
                        <div className="pt-3">
                            <Divider />
                        </div>
                        <TabsContent value="tiffin" className="pt-3">
                            <HydrationBoundary state={dehydrate(queryClient)}>
                                <TiffinOrders />
                            </HydrationBoundary>
                        </TabsContent>
                        <TabsContent value="catering" className="pt-3">
                            <HydrationBoundary state={dehydrate(queryClient)}>
                                <CateringOrders />
                            </HydrationBoundary>
                        </TabsContent>
                    </Tabs>
                </Box>
            </Stack>
        </Box>
    );
};

export default Orders;
