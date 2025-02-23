import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuButton from "./menu-button";
import MenuContent from "./menu-content";
import SignOutButton from "../sign-out-button";
import { Badge } from "../ui/badge";
import { MapPin } from "lucide-react";

interface SideMenuMobileProps {
    open: boolean | undefined;
    toggleDrawer: (newOpen: boolean) => () => void;
    username: string;
    role: string;
    location: string;
}

export default function SideMenuMobile({
    open,
    toggleDrawer,
    username,
    role,
    location,
}: SideMenuMobileProps) {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={toggleDrawer(false)}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                [`& .${drawerClasses.paper}`]: {
                    backgroundImage: "none",
                    backgroundColor: "background.paper",
                },
            }}
        >
            <Stack
                sx={{
                    width: "70dvw",
                    height: "100%",
                }}
            >
                <Stack
                    direction="row"
                    sx={{ p: 2, pb: 0, gap: 1, alignItems: "center" }}
                >
                    <Stack
                        direction="row"
                        sx={{ gap: 1, alignItems: "center", flexGrow: 1, p: 1 }}
                    >
                        <Avatar
                            sizes="small"
                            alt={username}
                            src="/static/images/avatar/7.jpg"
                            sx={{ width: 24, height: 24 }}
                            className="capitalize"
                        />
                        <Typography
                            component="p"
                            variant="h6"
                            className="text-primary capitalize"
                        >
                            {username} - {role}
                        </Typography>
                    </Stack>
                    <MenuButton showBadge>
                        <NotificationsRoundedIcon />
                    </MenuButton>
                </Stack>
                <div className="flex items-center gap-2 px-6 mb-2">
                    <Badge
                        variant="outline"
                        className="h-8 gap-1.5 rounded-lg px-3 text-sm font-light text-primary"
                    >
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="capitalize">{location}</span>
                    </Badge>
                </div>
                <Divider />
                <Stack sx={{ flexGrow: 1 }}>
                    <MenuContent />
                    <Divider />
                </Stack>
                <Stack sx={{ p: 2 }}>
                    <SignOutButton />
                </Stack>
            </Stack>
        </Drawer>
    );
}
