"use client";

import * as React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { usePathname } from "next/navigation";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: (theme.vars || theme).palette.action.disabled,
        margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: "center",
    },
}));

export default function NavbarBreadcrumbs() {
    const pathname = usePathname();
    // const currentPath = pathname.split("/").at(-1);

    return (
        <StyledBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextRoundedIcon fontSize="small" />}
        >
            {pathname
                .split("/")
                .filter((path) => !!path)
                .map((path, i) => (
                    <Typography
                        variant="body1"
                        key={i}
                        className="capitalize last:!font-medium"
                    >
                        {path}
                    </Typography>
                ))}
        </StyledBreadcrumbs>
    );
}
