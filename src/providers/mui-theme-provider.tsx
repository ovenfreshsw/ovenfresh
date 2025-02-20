"use client";

import AppTheme from "@/components/shared-theme/app-theme";
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from "@/theme/customizations";
import React from "react";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

const MuiThemeProvider = ({
    children,
    props,
}: {
    children: React.ReactNode;
    props: { disableCustomTheme?: boolean };
}) => {
    return (
        <AppTheme {...props} themeComponents={xThemeComponents}>
            {children}
        </AppTheme>
    );
};

export default MuiThemeProvider;
