import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import AppNavbar from "@/components/dashboard/app-navbar";
import SideMenu from "@/components/dashboard/sidemenu";
import MuiThemeProvider from "@/providers/mui-theme-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Store from "@/models/storeModel";
import ErrorComponent from "@/components/error";

export default async function DashboardLayout(
    { children }: { children: React.ReactNode },
    props: { disableCustomTheme?: boolean }
) {
    const session = await getServerSession(authOptions);

    if (
        !session?.user.id ||
        (!session?.user.storeId && session?.user.role !== "SUPERADMIN") ||
        (session?.user.role !== "MANAGER" &&
            session?.user.role !== "SUPERADMIN")
    ) {
        return (
            <ErrorComponent
                message="You are not authorized to access this page."
                code={403}
                title="Forbidden"
            />
        );
    }

    await connectDB();
    const allStores = await Store.find();
    const store = allStores.find((store) => store.id === session.user.storeId);

    return (
        <MuiThemeProvider props={props}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: "flex" }}>
                <SideMenu />
                <AppNavbar
                    role={session.user.role}
                    username={session.user.username}
                    active={{
                        id: store._id.toString(),
                        location: store.location,
                    }}
                    stores={allStores.map((store) => ({
                        id: store._id.toString(),
                        location: store.location,
                    }))}
                />
                {/* Main content */}
                {children}
            </Box>
        </MuiThemeProvider>
    );
}
