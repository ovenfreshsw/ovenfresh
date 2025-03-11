"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useRevenueExpenseAnalysis } from "@/api-hooks/admin/get-rne-analysis";
import { Frown } from "lucide-react";
import { getMonthsUpToCurrent } from "@/lib/utils";
import { MonthlyRevenueData } from "@/lib/types/finance";

// Define the types for store and service filters
type Store = "store1" | "store2" | "all";
type Service = "tiffin" | "catering" | "all";

export function RevenueExpenseCharts() {
    const [storeFilter, setStoreFilter] = useState<Store>("all");
    const [serviceFilter, setServiceFilter] = useState<Service>("all");
    const [monthFilter, setMonthFilter] = useState("all");

    // useQuery
    const { data, isPending } = useRevenueExpenseAnalysis();

    // Filter data based on selected filters
    const getFilteredData = (data: MonthlyRevenueData[]) => {
        let filteredData = [...data];

        if (monthFilter !== "all") {
            filteredData = filteredData.filter((item) =>
                item.name.toLowerCase().startsWith(monthFilter.toLowerCase())
            );
        }

        return filteredData;
    };

    const getVisibleKeys = () => {
        // If both filters are "all", return all keys
        if (storeFilter === "all" && serviceFilter === "all") {
            return data?.storeServiceMap.all.all;
        }

        // If only one filter is selected, use the dynamic map to return the filtered keys
        if (storeFilter !== "all" && serviceFilter !== "all") {
            return data?.storeServiceMap[storeFilter]?.[serviceFilter] || [];
        }

        if (storeFilter !== "all") {
            return data?.storeServiceMap[storeFilter].all;
        }

        if (serviceFilter !== "all") {
            return data?.storeServiceMap.all[serviceFilter];
        }

        return data?.storeServiceMap.all.all;
    };

    const visibleKeys = getVisibleKeys();
    const filteredRevenueData = getFilteredData(data?.revenueData || []);

    if (isPending) return <div>Loading...</div>;
    if (!data)
        return (
            <Card>
                <CardContent className="flex justify-center items-center flex-col pt-20 pb-20 gap-2">
                    <Frown className="animate-pulse size-7" />
                    <span>Unable to load data!</span>
                </CardContent>
            </Card>
        );

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        {/* <CardTitle>Revenue & Expense Analysis</CardTitle> */}
                        <CardTitle>Revenue Analysis</CardTitle>
                        <CardDescription>
                            Monthly performance by store and service
                        </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Select
                            value={storeFilter}
                            onValueChange={(value) =>
                                setStoreFilter(value as Store)
                            }
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Store Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                {data?.stores.map((store, i) => (
                                    <SelectItem value={store.value} key={i}>
                                        {store.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={serviceFilter}
                            onValueChange={(value) =>
                                setServiceFilter(value as Service)
                            }
                        >
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Service Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Services
                                </SelectItem>
                                <SelectItem value="tiffin">
                                    Tiffin Only
                                </SelectItem>
                                <SelectItem value="catering">
                                    Catering Only
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={monthFilter}
                            onValueChange={setMonthFilter}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Month Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                {getMonthsUpToCurrent().map((month) => (
                                    <SelectItem
                                        key={month.value}
                                        value={month.value}
                                    >
                                        {month.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-7">
                {/* <Tabs defaultValue="revenue"> */}
                {/* <TabsList className="mb-4">
                        <TabsTrigger value="revenue">Revenue</TabsTrigger>
                        <TabsTrigger value="expense">Expense</TabsTrigger>
                    </TabsList> */}

                {/* <TabsContent value="revenue"> */}
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredRevenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis
                                tickFormatter={(value) => `$${value / 1000}k`}
                            />
                            <Tooltip
                                formatter={(value) => [
                                    `
                                            $${Number(value).toLocaleString()}`,
                                    "",
                                ]}
                            />
                            <Legend />
                            {visibleKeys?.map((key) => (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    fill={data?.colorMap[key]}
                                    name={key}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* </TabsContent> */}

                {/* <TabsContent value="expense">
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={filteredExpenseData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis
                                        tickFormatter={(value) =>
                                            `$${value / 1000}k`
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value) => [
                                            `$${Number(
                                                value
                                            ).toLocaleString()}`,
                                            "",
                                        ]}
                                    />
                                    <Legend />
                                    {visibleKeys?.map((key) => (
                                        <Bar
                                            key={key}
                                            dataKey={key}
                                            fill={data?.colorMap[key]}
                                            name={key}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>
                </Tabs> */}
            </CardContent>
        </Card>
    );
}
