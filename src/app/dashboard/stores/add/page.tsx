import Header from "@/components/dashboard/header";
import { Box, Stack, Typography } from "@mui/material";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import AddStoreForm from "@/components/forms/add-store-form";

const AddStorePage = () => {
    return (
        <Box component="main" className="flex-grow overflow-auto">
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
                    <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                        Add new store
                    </Typography>
                    <div className="container mx-auto">
                        <Card className="max-w-3xl mx-auto">
                            <CardHeader>
                                <CardTitle>Create New Store</CardTitle>
                                <CardDescription>
                                    Fill in the details below to create a new
                                    store location.
                                </CardDescription>
                            </CardHeader>
                            <AddStoreForm />
                        </Card>
                    </div>
                </Box>
            </Stack>
        </Box>
    );
};

export default AddStorePage;
