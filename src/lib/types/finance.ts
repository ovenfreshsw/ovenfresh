export type RevenueStat = {
    total: number;
    tiffin: number;
    catering: number;
};

export interface MonthlyRevenueData {
    name: string;
    [key: string]: number | string;
}

type Store = "store1" | "store2" | "all";
type Service = "tiffin" | "catering" | "all";
type StoreServiceMap = {
    [key in Store]: {
        [key in Service]: string[];
    };
};

export type RNEAnalysisProps = {
    colorMap: Record<string, string>;
    revenueData: MonthlyRevenueData[];
    storeServiceMap: StoreServiceMap;
    stores: {
        value: string;
        name: string;
    }[];
};
