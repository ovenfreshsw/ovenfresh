"use client";

import RevenueStatCard from "./revenue-stat-card";
import RevenueStatCardSkeleton from "../skeleton/revenue-stat-card-skeleton";
import { useStoresPending } from "@/api-hooks/admin/get-stores-pending";

const StoresPending = () => {
    const { data, isPending } = useStoresPending();
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
                    title={`Pending - ${store.location}`}
                    data={store.data}
                    key={i}
                />
            ))}
        </>
    );
};

export default StoresPending;
