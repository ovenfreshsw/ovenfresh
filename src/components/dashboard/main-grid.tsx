import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StatCard from "./stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChevronRight } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";
import KitchenIcon from "@mui/icons-material/Kitchen";
import TakeoutDiningIcon from "@mui/icons-material/TakeoutDiningRounded";
import RecentCateringOrderTable from "../data-table/recent-catering-order-table";
import RecentTiffinOrderTable from "../data-table/recent-tiffin-order-table";

type StatCardsProps = {
    percentageChange: string;
    trend: string;
    data: number[];
    totalLast30Days: number;
};

export default function MainGrid({
    tiffinStat,
    cateringStat,
    tiffinCount,
    cateringCount,
}: {
    tiffinStat: StatCardsProps;
    cateringStat: StatCardsProps;
    tiffinCount: number;
    cateringCount: number;
}) {
    return (
        <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
            {/* cards */}
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Overview
            </Typography>
            <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
                    <Card className="w-full h-full bg-primary-foreground shadow-sm rounded-lg flex flex-col">
                        <CardHeader className="p-4 pt-2 flex-row items-center justify-between">
                            <CardTitle className="font-medium">
                                Orders Scheduled for Today:
                            </CardTitle>

                            <Link href={"/dashboard/scheduled"}>
                                <Button
                                    size={"sm"}
                                    className="flex items-center"
                                >
                                    View all
                                    <ChevronRight size={15} />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-5 pt-0 flex-1 flex items-center">
                            <div className="flex items-start justify-evenly w-full">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <KitchenIcon className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg">
                                            Tiffin Orders
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {tiffinCount}
                                        </p>
                                    </div>
                                </div>
                                <Separator
                                    orientation="vertical"
                                    className="mx-4 h-12"
                                />
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <TakeoutDiningIcon className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg">
                                            Catering Orders
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {cateringCount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
                <Grid size={{ xs: 12 }}>
                    <RecentCateringOrderTable />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <RecentTiffinOrderTable />
                </Grid>
            </Grid>
        </Box>
    );
}
