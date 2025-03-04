type OrderStatCount = {
    tiffinStatCounts: {
        total: number;
        pending: number;
        delivered: number;
    };
    cateringStatCounts: {
        total: number;
        pending: number;
        delivered: number;
    };
};

type StatCardProps = {
    title: string;
    value: string;
    interval: string;
    trend: "up" | "down" | "neutral";
    data: number[];
    percentage?: string;
};

type TiffinDeliveryOrderStats = {
    total: number;
    pending: number;
    completed: number;
};

export type { OrderStatCount, StatCardProps, TiffinDeliveryOrderStats };
