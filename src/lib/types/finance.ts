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

export type RevenueBreakdownProps = {
    store: string;
    tiffin: number;
    catering: number;
};

export type PendingDetailsProps = {
    _id: string;
    store: string;
    orderId: string;
    customerName: string;
    order: string;
    pendingBalance: number;
    due: Date;
};

export type ExpenseDetailsProps = {
    _id: string;
    store: string;
    item: string;
    quantity: number;
    price: number;
    tax: number;
    total: number;
    unit: string;
    date: Date;
};

export type ExpenseStat = {
    total: number;
    items: number;
    stores: { location: string; total: number; items: number }[];
};

interface ExpenseData {
    total: number;
    items: number;
}

interface MonthlyExpense {
    month: string;
    expenses: Record<string, ExpenseData>;
}
export interface MonthlyExpenseTrendProps {
    expensesData: MonthlyExpense[];
    stores: string[];
}

export type ProfitDetailsProps = {
    store: string;
    totalRevenue: number;
    totalExpense: number;
    totalProfit: number;
};
