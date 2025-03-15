"use client";

import React from "react";
import RevenueStatCardSkeleton from "../skeleton/revenue-stat-card-skeleton";
import RevenueStatCard from "./revenue-stat-card";
import { useTotalPending } from "@/api-hooks/admin/get-total-pending";

const TotalPending = () => {
    const { data, isPending } = useTotalPending();
    if (isPending) return <RevenueStatCardSkeleton />;
    return <RevenueStatCard title="Total Pending" data={data} />;
};

export default TotalPending;
