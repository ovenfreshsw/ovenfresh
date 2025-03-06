import * as React from "react";
import Stack from "@mui/material/Stack";
import NavbarBreadcrumbs from "./navbar-breadcrumbs";
import StoreDisplay from "./store-display";
import { Skeleton } from "../ui/skeleton";
// import { Badge } from "@heroui/badge";

export default async function Header() {
    return (
        <Stack
            direction="row"
            sx={{
                display: { xs: "none", md: "flex" },
                width: "100%",
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                maxWidth: { sm: "100%", md: "1700px" },
                p: 1.5,
            }}
            className="bg-primary"
            // className="bg-primary sticky top-0 z-50"
            spacing={2}
        >
            <NavbarBreadcrumbs />
            <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                {/* <button className="px-1 flex items-center">
                    <Badge
                        color="danger"
                        content=""
                        placement="top-right"
                        shape="circle"
                        classNames={{
                            badge: "border-none min-h-2 min-w-2 w-2.5 h-2.5",
                        }}
                    >
                        <NotificationsRoundedIcon className="text-primary-foreground" />
                    </Badge>
                </button> */}
                <React.Suspense
                    fallback={
                        <>
                            <Skeleton className="h-9 w-[131px] rounded-xl bg-primary-foreground/40" />
                            <Skeleton className="h-[42px] w-48 rounded-xl bg-primary-foreground/40" />
                        </>
                    }
                >
                    <StoreDisplay />
                </React.Suspense>
            </Stack>
        </Stack>
    );
}
