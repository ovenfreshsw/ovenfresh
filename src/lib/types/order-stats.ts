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

export type { OrderStatCount, StatCardProps };
