import Header from "@/components/dashboard/header";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getStoresServer } from "@/lib/api/stores/get-stores";
import StoresTable from "@/components/data-table/stores-table";

const Stores = async () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity } },
    });
    await queryClient.prefetchQuery({
        queryKey: ["stores"],
        queryFn: getStoresServer,
    });

    return (
        <Box component="main" className="flex-grow overflow-auto">
            <Header />
            <Stack
                spacing={2}
                sx={{
                    alignItems: "center",
                    mx: { xs: 1.5, md: 3 },
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
                    <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                        Stores
                    </Typography>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <StoresTable />
                    </HydrationBoundary>
                </Box>
            </Stack>
        </Box>
    );
};

export default Stores;
