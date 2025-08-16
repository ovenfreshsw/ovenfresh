"use client";

import { useDeliveryOrders } from "@/api-hooks/delivery/get-delivery-order";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Show } from "../show";
import OrderCard from "./order-card";

const SortedOrderList = ({
    status,
    orderType,
}: {
    status: string;
    orderType: "tiffins" | "caterings";
}) => {
    const { data, isPending } = useDeliveryOrders(orderType);

    const spreadOrders = useMemo(() => {
        return data?.orders.filter((order) => order.status === status);
    }, [data, status]);

    return (
        <Show>
            <Show.When isTrue={isPending}>
                <div className="flex justify-center items-center h-32 flex-col">
                    <Loader2 className="animate-spin" />
                    <span>Loading...</span>
                </div>
            </Show.When>
            <Show.When
                isTrue={
                    spreadOrders !== undefined &&
                    (spreadOrders?.length || 0) > 0
                }
            >
                {spreadOrders?.map((order) => (
                    <OrderCard
                        order={order}
                        orderType={orderType}
                        key={order.orderId}
                    />
                ))}
            </Show.When>
            <Show.Else>
                <Show>
                    <Show.When isTrue={(spreadOrders?.length || 0) > 0}>
                        <div className="flex justify-center items-center h-32 flex-col">
                            <Loader2 className="animate-spin" />
                            <span>Loading...</span>
                        </div>
                    </Show.When>
                    <Show.Else>
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">
                                No orders to display!
                            </p>
                        </div>
                    </Show.Else>
                </Show>
            </Show.Else>
        </Show>
    );
};

export default SortedOrderList;
