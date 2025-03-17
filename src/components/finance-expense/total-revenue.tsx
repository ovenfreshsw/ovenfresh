"use client";

import { useTotalRevenue } from "@/api-hooks/admin/get-total-revenue";
import React from "react";
import RevenueStatCardSkeleton from "../skeleton/revenue-stat-card-skeleton";
import RevenueStatCard from "./revenue-stat-card";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const TotalRevenue = () => {
    const yearFilter = useSelector((state: RootState) => state.selectYear);
    const { data, isPending } = useTotalRevenue(yearFilter);
    if (isPending) return <RevenueStatCardSkeleton />;
    return <RevenueStatCard title="Total Revenue" data={data} />;
};

export default TotalRevenue;
