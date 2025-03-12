import Header from "@/components/dashboard/header";
import CateringMenuTable from "@/components/data-table/catering/menu-table";
import ServerWrapper from "@/components/delivery/server-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCateringMenuServer } from "@/lib/api/menu/get-catering-menu";
import { Box, Divider, Stack } from "@mui/material";
import { Suspense } from "react";

const MenusPage = () => {
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
                    mx: 3,
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
                    <Tabs defaultValue="catering">
                        <TabsList>
                            <TabsTrigger value="catering">Catering</TabsTrigger>
                            <TabsTrigger value="category">Category</TabsTrigger>
                            <TabsTrigger value="tiffin">Tiffin</TabsTrigger>
                        </TabsList>
                        <div className="pt-3">
                            <Divider />
                        </div>
                        <TabsContent value="catering">
                            <Suspense fallback={<div>Loading...</div>}>
                                <ServerWrapper
                                    queryFn={getCateringMenuServer}
                                    queryKey={["menu", "catering"]}
                                >
                                    <CateringMenuTable />
                                </ServerWrapper>
                            </Suspense>
                        </TabsContent>
                        {/* <TabsContent value="category">
                            <Suspense fallback={<div>Loading...</div>}>
                                <ServerWrapper
                                    queryFn={getCateringCategoryMServer}
                                    queryKey={["menu", "category"]}
                                >
                                    <CateringCategoryTable />
                                </ServerWrapper>
                            </Suspense>
                        </TabsContent> */}
                        <TabsContent value="tiffin">
                            Change your password here.
                        </TabsContent>
                    </Tabs>
                </Box>
            </Stack>
        </Box>
    );
};

export default MenusPage;
