import Header from "@/components/dashboard/header";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getStaffsServer } from "@/lib/api/staffs/get-staffs";
import StaffsTable from "@/components/data-table/staffs-table";
import { getStoresServer } from "@/lib/api/stores/get-stores";

const Staffs = async () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity } },
    });
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ["staffs"],
            queryFn: getStaffsServer,
        }),
        queryClient.prefetchQuery({
            queryKey: ["stores"],
            queryFn: getStoresServer,
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
                        Staffs
                    </Typography>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <StaffsTable />
                    </HydrationBoundary>
                </Box>
            </Stack>
        </Box>
    );
};

export default Staffs;
