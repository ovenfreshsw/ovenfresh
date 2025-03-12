import CateringFormStepper from "@/components/catering/catering-form-stepper";
import Header from "@/components/dashboard/header";
import TiffinForm from "@/components/forms/tiffin-form";
import { Box, Divider, Stack } from "@mui/material";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getCateringMenuServer } from "@/lib/api/menu/get-catering-menu";
import { getTiffinMenuServer } from "@/lib/api/menu/get-tiffin-menu";

const Booking = async () => {
    const queryClient = new QueryClient();
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ["menu", "catering"],
            queryFn: getCateringMenuServer,
        }),
        queryClient.prefetchQuery({
            queryKey: ["menu", "tiffin"], // Unique key for tiffin menu
            queryFn: getTiffinMenuServer,
        }),
    ]);

    return (
        <Box component="main" className="flex-grow">
            <Header />
            <Stack
                spacing={2}
                sx={{
                    alignItems: "center",
                    mx: { xs: 1, md: 3 },
                    pb: 5,
                    pt: { xs: 2, md: 0 },
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
                                Tiffin Booking
                            </TabsTrigger>
                            <TabsTrigger value="catering">
                                Catering Booking
                            </TabsTrigger>
                        </TabsList>
                        <div className="pt-3">
                            <Divider />
                        </div>
                        <TabsContent value="tiffin" className="pt-3">
                            <HydrationBoundary state={dehydrate(queryClient)}>
                                <TiffinForm />
                            </HydrationBoundary>
                        </TabsContent>
                        <TabsContent value="catering" className="pt-3">
                            <HydrationBoundary state={dehydrate(queryClient)}>
                                <CateringFormStepper />
                            </HydrationBoundary>
                        </TabsContent>
                    </Tabs>
                </Box>
            </Stack>
        </Box>
    );
};

export default Booking;
