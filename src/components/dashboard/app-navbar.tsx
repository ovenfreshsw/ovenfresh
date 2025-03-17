"use client";

import * as React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MuiToolbar from "@mui/material/Toolbar";
import { tabsClasses } from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import SideMenuMobile from "./sidemenu-mobile";
import { Button } from "../ui/button";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setState } from "@/store/slices/selectStoreSlice";

const Toolbar = styled(MuiToolbar)({
    width: "100%",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "center",
    gap: "12px",
    flexShrink: 0,
    [`& ${tabsClasses.flexContainer}`]: {
        gap: "8px",
        p: "8px",
        pb: 0,
    },
});

export default function AppNavbar({
    username,
    role,
    active,
    stores,
}: {
    username: string;
    role: string;
    active: { id: string; location: string };
    stores: { id: string; location: string }[];
}) {
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(setState(active.id));
    }, [active.id]);

    return (
        <AppBar
            position="fixed"
            sx={{
                display: { xs: "auto", md: "none" },
                boxShadow: 0,
                backgroundImage: "none",
                borderBottom: "1px solid",
                borderColor: "divider",
                top: "var(--template-frame-height, 0px)",
            }}
            className="bg-primary"
        >
            <Toolbar variant="regular">
                <Stack
                    direction="row"
                    sx={{
                        alignItems: "center",
                        flexGrow: 1,
                        width: "100%",
                        gap: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            justifyContent: "center",
                            mr: "auto",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Image
                            src={"/logo.webp"}
                            alt="logo"
                            width={35}
                            height={30}
                        />
                        <Typography
                            variant="h4"
                            component="h1"
                            className="text-primary-foreground"
                        >
                            Dashboard
                        </Typography>
                    </Stack>
                    <Button
                        variant={"outline"}
                        size={"icon"}
                        aria-label="menu"
                        onClick={() => setOpen(true)}
                        className="bg-primary-foreground text-primary"
                    >
                        <MenuRoundedIcon />
                    </Button>
                    <SideMenuMobile
                        open={open}
                        setOpen={setOpen}
                        role={role}
                        username={username}
                        active={active}
                        stores={stores}
                    />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export function CustomIcon() {
    return (
        <Box
            sx={{
                width: "1.5rem",
                height: "1.5rem",
                bgcolor: "black",
                borderRadius: "999px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                backgroundImage:
                    "linear-gradient(135deg, hsl(210, 98%, 60%) 0%, hsl(210, 100%, 35%) 100%)",
                color: "hsla(210, 100%, 95%, 0.9)",
                border: "1px solid",
                borderColor: "hsl(210, 100%, 55%)",
                boxShadow: "inset 0 2px 5px rgba(255, 255, 255, 0.3)",
            }}
        >
            <DashboardRoundedIcon color="inherit" sx={{ fontSize: "1rem" }} />
        </Box>
    );
}
