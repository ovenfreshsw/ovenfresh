import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Header from "@/components/dashboard/header";
import MainGrid from "@/components/dashboard/main-grid";
import connectDB from "@/lib/mongodb";
import Tiffin from "@/models/tiffinModel";
import Catering from "@/models/cateringModel";
import { Model } from "mongoose";

export default async function Dashboard() {
    await connectDB();

    // Define OrderDocument type for Mongoose documents
    interface OrderDocument extends Document {
        createdAt: Date;
    }

    // Function to generate the last 30 days as strings
    const generateLastNDays = (days: number): string[] => {
        return Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split("T")[0]; // Format: "YYYY-MM-DD"
        }).reverse();
    };

    // Get last 30 and previous 30 days
    const last30Days: string[] = generateLastNDays(30);
    const prev30Days: string[] = generateLastNDays(30).map((date) => {
        const d = new Date(date);
        d.setDate(d.getDate() - 30);
        return d.toISOString().split("T")[0];
    });

    const sixtyDaysAgo: Date = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Define return type
    interface OrderStats {
        totalLast30Days: number;
        totalPrev30Days: number;
        percentageChange: string;
        trend: "up" | "down" | "same";
        last30DaysCounts: number[];
    }

    // Function to fetch order statistics
    const fetchOrderStats = async (
        Model: Model<OrderDocument>
    ): Promise<OrderStats> => {
        const orderSummary = await Model.aggregate([
            { $match: { createdAt: { $gte: sixtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const orderCountsMap: Record<string, number> = {};

        // Populate counts from MongoDB
        orderSummary.forEach(
            ({ _id, count }: { _id: string; count: number }) => {
                orderCountsMap[_id] = count;
            }
        );

        // Ensure all 30 days have values, defaulting to 0 if missing
        const last30DaysCounts: number[] = last30Days.map(
            (date) => orderCountsMap[date] || 0
        );
        const prev30DaysCounts: number[] = prev30Days.map(
            (date) => orderCountsMap[date] || 0
        );

        // Calculate total orders for last 30 days and previous 30 days
        const totalLast30Days: number = last30DaysCounts.reduce(
            (sum, count) => sum + count,
            0
        );
        const totalPrev30Days: number = prev30DaysCounts.reduce(
            (sum, count) => sum + count,
            0
        );

        // Calculate percentage change
        const percentageChange: number =
            totalPrev30Days === 0
                ? totalLast30Days > 0
                    ? 100
                    : 0
                : ((totalLast30Days - totalPrev30Days) / totalPrev30Days) * 100;

        const formattedPercentageChange = percentageChange.toFixed(0);

        // Determine trend
        let trend: "up" | "down" | "same" = "same";
        if (totalLast30Days > totalPrev30Days) {
            trend = "up";
        } else if (totalLast30Days < totalPrev30Days) {
            trend = "down";
        }

        return {
            totalLast30Days,
            totalPrev30Days,
            percentageChange: formattedPercentageChange,
            trend,
            last30DaysCounts,
        };
    };

    // Fetch stats for both Tiffin and Catering
    const getStats = async () => {
        const [tiffinStats, cateringStats] = await Promise.all([
            fetchOrderStats(Tiffin),
            fetchOrderStats(Catering),
        ]);

        return { tiffinStats, cateringStats };
    };

    const { tiffinStats, cateringStats } = await getStats();

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                overflow: "auto",
                // position: "relative",
            }}
        >
            <Header />
            <Stack
                spacing={2}
                sx={{
                    alignItems: "center",
                    mx: 3,
                    pb: 5,
                    mt: { xs: 8, md: 2 },
                }}
            >
                <MainGrid
                    tiffinStat={{
                        percentageChange:
                            tiffinStats.trend === "up"
                                ? `+${tiffinStats.percentageChange}%`
                                : `-${tiffinStats.percentageChange}%`,
                        trend: tiffinStats.trend,
                        data: tiffinStats.last30DaysCounts,
                        totalLast30Days: tiffinStats.totalLast30Days,
                    }}
                    cateringStat={{
                        percentageChange:
                            cateringStats.trend === "up"
                                ? `+${cateringStats.percentageChange}%`
                                : `-${cateringStats.percentageChange}%`,
                        trend: cateringStats.trend,
                        data: cateringStats.last30DaysCounts,
                        totalLast30Days: cateringStats.totalLast30Days,
                    }}
                />
            </Stack>
        </Box>
    );
}
