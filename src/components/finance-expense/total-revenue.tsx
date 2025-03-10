"use client";

import { useTotalRevenue } from "@/api-hooks/admin/get-total-revenue";
import React from "react";
import RevenueStatCardSkeleton from "../skeleton/revenue-stat-card-skeleton";
import RevenueStatCard from "./revenue-stat-card";

const TotalRevenue = () => {
    const { data, isPending } = useTotalRevenue();
    if (isPending) return <RevenueStatCardSkeleton />;
    return <RevenueStatCard title="Total Revenue" data={data} />;
};

export default TotalRevenue;
