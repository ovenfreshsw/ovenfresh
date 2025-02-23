"use client";

import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StatCard from "./stat-card";
import BookingCard from "./booking-card";

export default function MainGrid({
    tiffinStat,
    cateringStat,
}: {
    tiffinStat: {
        percentageChange: string;
        trend: string;
        data: number[];
        totalLast30Days: number;
    };
    cateringStat: {
        percentageChange: string;
        trend: string;
        data: number[];
        totalLast30Days: number;
    };
}) {
    return (
        <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
            {/* cards */}
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Overview
            </Typography>
            <Grid
                container
                spacing={2}
                columns={12}
                sx={{ mb: (theme) => theme.spacing(2) }}
            >
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <BookingCard />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        percentage={tiffinStat.percentageChange}
                        data={tiffinStat.data}
                        interval="Last 30 days"
                        title="Tiffin Orders"
                        trend={tiffinStat.trend as "up"}
                        value={tiffinStat.totalLast30Days.toString()}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        percentage={cateringStat.percentageChange}
                        data={cateringStat.data}
                        interval="Last 30 days"
                        title="Catering Orders"
                        trend={cateringStat.trend as "up"}
                        value={cateringStat.totalLast30Days.toString()}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>{/* <SessionsChart /> */}</Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    {/* <PageViewsBarChart /> */}
                </Grid>
            </Grid>
        </Box>
    );
}
