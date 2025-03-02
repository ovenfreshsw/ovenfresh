"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ChevronRight } from "lucide-react";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import Link from "next/link";
import KitchenIcon from "@mui/icons-material/Kitchen";
import TakeoutDiningIcon from "@mui/icons-material/TakeoutDiningRounded";
import React from "react";
import { useOrderStatsCount } from "@/api-hooks/order-stats-count";
import ScheduledStatSkeleton from "@/components/skeleton/scheduled-stat-skeleton";

const ScheduledStatCard = () => {
    const { data, isPending } = useOrderStatsCount();

    if (isPending) return <ScheduledStatSkeleton />;

    return (
        <Card className="w-full h-full bg-primary-foreground shadow-sm rounded-lg flex flex-col">
            <CardHeader className="p-4 pt-2 flex-row items-center justify-between">
                <CardTitle className="font-medium">
                    Orders Scheduled for Today:
                </CardTitle>

                <Link href={"/dashboard/scheduled"}>
                    <Button size={"sm"} className="flex items-center">
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
                            <p className="font-medium text-lg">Tiffin Orders</p>
                            <p className="leading-tight flex justify-between text-sm">
                                Total:{" "}
                                <span className="font-bold">
                                    {data?.tiffinStatCounts.total}
                                </span>
                            </p>
                            <p className="leading-tight flex justify-between text-sm">
                                Delivered:{" "}
                                <span className="font-bold">
                                    {data?.tiffinStatCounts.delivered}
                                </span>
                            </p>
                            <p className="leading-tight flex justify-between text-sm">
                                Pending:{" "}
                                <span className="font-bold">
                                    {data?.tiffinStatCounts.pending}
                                </span>
                            </p>
                        </div>
                    </div>
                    <Separator orientation="vertical" className="mx-4 h-12" />
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <TakeoutDiningIcon className="size-5 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium text-lg">
                                Catering Orders
                            </p>
                            <p className="leading-tight flex justify-between text-sm">
                                Total:{" "}
                                <span className="font-bold">
                                    {data?.cateringStatCounts.total}
                                </span>
                            </p>
                            <p className="leading-tight flex justify-between text-sm">
                                Delivered:{" "}
                                <span className="font-bold">
                                    {data?.cateringStatCounts.delivered}
                                </span>
                            </p>
                            <p className="leading-tight flex justify-between text-sm">
                                Pending:{" "}
                                <span className="font-bold">
                                    {data?.cateringStatCounts.pending}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ScheduledStatCard;
