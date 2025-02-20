"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontFamily: "var(--font-poppins)",
    },
    cssVariables: true,
});

export default theme;
