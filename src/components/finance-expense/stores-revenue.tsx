"use client";

import { useStoresRevenue } from "@/api-hooks/admin/get-stores-revenue";
import RevenueStatCard from "./revenue-stat-card";
import RevenueStatCardSkeleton from "../skeleton/revenue-stat-card-skeleton";

const StoresRevenue = () => {
    const { data, isPending } = useStoresRevenue();
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
