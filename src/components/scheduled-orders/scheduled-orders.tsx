"use client";

import { useScheduledOrders } from "@/api-hooks/scheduled-orders/get-tiffin-orders";
import ScheduledOrderTable from "../data-table/scheduled-order-table";
import { useMemo, useState } from "react";
import { format, isToday, isTomorrow } from "date-fns";
import { Typography } from "@mui/material";

const ScheduledOrders = ({ storeId }: { storeId: string }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const queryKey = useMemo(
        () => [
            "orders",
            "scheduled",
            storeId,
            format(selectedDate, "yyyy-MM-dd"),
        ],
        [selectedDate, storeId]
    );

    const { data: scheduledOrders, isPending } = useScheduledOrders(
        selectedDate,
        storeId,
        queryKey
    );

    const formattedDate = useMemo(() => {
        if (isToday(selectedDate)) return "Today";
        if (isTomorrow(selectedDate)) return "Tomorrow";
        return format(selectedDate, "PPP");
    }, [selectedDate]);

    return (
        <>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Scheduled Orders for {formattedDate}
            </Typography>
            <ScheduledOrderTable
                isPending={isPending}
                orders={scheduledOrders || []}
                date={selectedDate}
                onDateChange={setSelectedDate}
            />
        </>
    );
};

export default ScheduledOrders;
