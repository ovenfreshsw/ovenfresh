import Header from "@/components/dashboard/header";
import DeliveryProof from "@/components/delivery-proof/delivery-proof";
import ServerWrapper from "@/components/server-wrapper";
import { getDeliveryProofServer } from "@/lib/api/delivery-proof/get-delivery-proof-server";
import { Box, Stack } from "@mui/material";
import { Suspense } from "react";

const DeliveryProofPage = () => {
    return (
        <Box component="main" className="flex-grow">
            <Header />
            <Stack
                spacing={2}
                sx={{
                    alignItems: "center",
                    mx: { xs: 1.5, sm: 3 },
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
                    <Suspense fallback={<div>Loading...</div>}>
                        <ServerWrapper
                            queryFn={getDeliveryProofServer}
                            queryKey={["delivery-proof"]}
                        >
                            <DeliveryProof />
                        </ServerWrapper>
                    </Suspense>
                </Box>
            </Stack>
        </Box>
    );
};

export default DeliveryProofPage;
