"use client";

import { useStoresRevenue } from "@/api-hooks/admin/get-stores-revenue";
import RevenueStatCard from "./revenue-stat-card";
import RevenueStatCardSkeleton from "../skeleton/revenue-stat-card-skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const StoresRevenue = () => {
    const yearFilter = useSelector((state: RootState) => state.selectYear);
    const { data, isPending } = useStoresRevenue(yearFilter);
    if (isPending)
        return (
            <>
                <RevenueStatCardSkeleton />
            </>
        );
    return (
        <>
            {data?.map((store, i) => (
                <RevenueStatCard
                    title={`Revenue - ${store.location}`}
                    data={store.data}
                    key={i}
                />
            ))}
        </>
    );
};

export default StoresRevenue;
