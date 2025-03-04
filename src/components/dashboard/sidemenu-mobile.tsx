import * as React from "react";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuContent from "./menu-content";
import SignOutButton from "../sign-out-button";
import { Badge as ShadBadge } from "../ui/badge";
import { Badge } from "@heroui/badge";
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
                    backgroundColor: "#f8f1e9",
                },
            }}
        >
            <Stack
                sx={{
                    width: "80dvw",
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
                        <Avatar>
                            <AvatarImage
                                src="/static/images/avatar/7.jpg"
                                alt={username}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground capitalize">
                                {username.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center flex-col">
                            <h6 className="text-primary capitalize text-lg">
                                {username}
                            </h6>
                            <p className="text-primary/70 text-xs">
                                &#040;
                                <span>{role}</span>
                                &#041;
                            </p>
                        </div>
                    </Stack>
                    <Badge
                        color="danger"
                        content=""
                        placement="top-right"
                        shape="circle"
                    >
                        <NotificationsRoundedIcon color="primary" />
                    </Badge>
                </Stack>
                <div className="flex items-center gap-2 px-6 mb-2">
                    <ShadBadge
                        variant="outline"
                        className="h-8 gap-1.5 rounded-lg px-3 text-sm font-light text-primary"
                    >
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="capitalize">{location}</span>
                    </ShadBadge>
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
