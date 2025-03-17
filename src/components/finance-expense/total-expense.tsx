"use client";

import { useTotalExpense } from "@/api-hooks/admin/get-total-expense";
import ExpenseStatCard from "./expense-stat-card";
import ExpenseStatCardSkeleton from "../skeleton/expense-stat-card-skeleton";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const TotalExpense = () => {
    const yearFilter = useSelector((state: RootState) => state.selectYear);
    const { data, isPending } = useTotalExpense(yearFilter);
    if (isPending)
        return (
            <>
                <ExpenseStatCardSkeleton />
                <ExpenseStatCardSkeleton />
                <ExpenseStatCardSkeleton />
            </>
        );
    return (
        <>
            <ExpenseStatCard
                title="Total Expense"
                total={data?.total || 0}
                items={data?.items || 0}
            />
            {data?.stores.map((store, i) => (
                <ExpenseStatCard
                    key={store.location + i}
                    title={`Expense - ${store.location}`}
                    total={store.total || 0}
                    items={store.items || 0}
                />
            ))}
        </>
    );
};

export default TotalExpense;
