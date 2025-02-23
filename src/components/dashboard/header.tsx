import * as React from "react";
import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import NavbarBreadcrumbs from "./navbar-breadcrumbs";
import MenuButton from "./menu-button";
import { NavUser } from "../nav/user";
import { MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Store from "@/models/storeModel";

export default async function Header() {
    const session = await getServerSession(authOptions);

    if (
        !session?.user.id ||
        (!session?.user.storeId && session?.user.role !== "SUPERADMIN")
    )
        return null;

    await connectDB();
    const store = await Store.findById(session.user.storeId);

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
                <MenuButton showBadge aria-label="Open notifications">
                    <NotificationsRoundedIcon className="text-white" />
                </MenuButton>
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className="h-8 gap-1.5 rounded-lg px-3 text-sm font-light text-white"
                    >
                        <MapPin className="h-4 w-4" />
                        <span className="capitalize">{store.location}</span>
                    </Badge>
                </div>
                <NavUser
                    user={{
                        avatar: "",
                        name: session.user.username,
                        role: session.user.role.toLowerCase(),
                    }}
                />
            </Stack>
        </Stack>
    );
}
