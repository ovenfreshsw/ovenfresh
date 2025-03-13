import Header from "@/components/dashboard/header";
import { Box, Stack } from "@mui/material";
import CateringCategory from "@/models/cateringCategoryModel";
import MenuForm from "@/components/forms/add-menu-form";

const AddMenuPage = async () => {
    const categories = await CateringCategory.find({});

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
                    <MenuForm
                        categories={
                            JSON.parse(JSON.stringify(categories)) || []
                        }
                    />
                </Box>
            </Stack>
        </Box>
    );
};

export default AddMenuPage;
