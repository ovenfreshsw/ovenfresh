"use client";

import AppTheme from "@/components/shared-theme/app-theme";
import React from "react";

const MuiThemeProvider = ({
    children,
    props,
}: {
    children: React.ReactNode;
    props: { disableCustomTheme?: boolean };
}) => {
    return <AppTheme {...props}>{children}</AppTheme>;
};

export default MuiThemeProvider;
