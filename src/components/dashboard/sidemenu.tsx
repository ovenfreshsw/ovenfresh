"use client";

import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MenuContent from "./menu-content";
import Image from "next/image";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: "border-box",
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: "border-box",
    },
});

export default function SideMenu() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: "none", lg: "block" },
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: "background.paper",
                },
            }}
        >
            {/* <Box
                sx={{
                    display: "flex",
                    mt: "calc(var(--template-frame-height, 0px) + 4px)",
                    p: 1.5,
                }}
            >
                <SelectContent />
            </Box> */}
            {/* <Divider /> */}
            <div className="flex justify-center py-3">
                <Image src={"/logo.webp"} alt="logo" width={100} height={100} />
            </div>
            <Box
                sx={{
                    overflow: "auto",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <MenuContent />
            </Box>
        </Drawer>
    );
}
