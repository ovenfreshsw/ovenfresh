"use client";

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";
import { useLastMonthStats } from "@/api-hooks/last-month-stat";
import StatCardSKeleton from "@/components/skeleton/stat-card-skeleton";

function getLast30Days() {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - i);

        const formattedDate = pastDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });

        days.push(formattedDate);
    }

    return days.reverse(); // Reverse to show oldest first
}

function AreaGradient({ color, id }: { color: string; id: string }) {
    return (
        <defs>
            <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
        </defs>
    );
}

export default function StatCard() {
    const { data, isPending } = useLastMonthStats("tiffin");

    const theme = useTheme();

    const daysInWeek = getLast30Days();

    const trendColors = {
        up: theme.palette.success.main,
        down: theme.palette.error.main,
        neutral: theme.palette.grey[400],
    };

    const labelColors = {
        up: "success" as const,
        down: "error" as const,
        neutral: "default" as const,
    };

    if (!data) return <h1>Failed to retrieve data</h1>;

    const color = labelColors[data.trend];
    const chartColor = trendColors[data.trend];
    const trendValues = { up: "+25%", down: "-25%", neutral: "+5%" };

    if (isPending) return <StatCardSKeleton />;

    return (
        <Card
            variant="outlined"
            sx={{ height: "100%", flexGrow: 1 }}
            className="!bg-primary-foreground"
        >
            <CardContent className="bg-transparent">
                <Typography
                    component="h2"
                    variant="subtitle2"
                    gutterBottom
                    className="capitalize"
                >
                    {data.title}
                </Typography>
                <Stack
                    direction="column"
                    sx={{
                        justifyContent: "space-between",
                        flexGrow: "1",
                        gap: 1,
                    }}
                >
                    <Stack sx={{ justifyContent: "space-between" }}>
                        <Stack
                            direction="row"
                            sx={{
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h4" component="p">
                                {data.value}
                            </Typography>
                            <Chip
                                size="small"
                                color={color}
                                label={
                                    data.percentage
                                        ? data.percentage
                                        : trendValues[data.trend]
                                }
                            />
                        </Stack>
                        <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                        >
                            Last 30 days
                        </Typography>
                    </Stack>
                    <Box sx={{ width: "100%", height: 50 }}>
                        <SparkLineChart
                            colors={[chartColor]}
                            data={data.data}
                            area
                            showHighlight
                            showTooltip
                            xAxis={{
                                scaleType: "band",
                                data: daysInWeek, // Use the correct property 'data' for xAxis
                            }}
                            sx={{
                                [`& .${areaElementClasses.root}`]: {
                                    fill: `url(#area-gradient-${data.value})`,
                                },
                            }}
                        >
                            <AreaGradient
                                color={chartColor}
                                id={`area-gradient-${data.value}`}
                            />
                        </SparkLineChart>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}
