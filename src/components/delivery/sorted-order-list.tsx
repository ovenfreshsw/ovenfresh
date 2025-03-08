"use client";

import { useDeliveryOrders } from "@/api-hooks/delivery/get-delivery-order";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { BadgeCheck, Check, Clock, Loader2, MapPin, Phone } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";
import { Chip } from "@heroui/chip";
import { ConfirmDeliveryDrawer } from "../drawer/delivery/confirm-delivery-drawer";
import { Show } from "../show";
import { DeliveryRes } from "@/lib/types/sorted-order";

const SortedOrderList = ({
    status,
    orderType,
}: {
    status: string;
    orderType: "tiffin" | "catering";
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
                    <Card key={order._id} className="mb-4">
                        <CardHeader className="pb-2 px-3 pt-3">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">
                                    {order.orderId}
                                </CardTitle>
                                <Chip
                                    variant={order.fullyPaid ? "solid" : "flat"}
                                    color={
                                        order.fullyPaid ? "primary" : "success"
                                    }
                                    size="sm"
                                >
                                    {order.fullyPaid ? (
                                        <div className="flex items-center gap-1">
                                            <Check className="h-3 w-3 mr-1" />{" "}
                                            Paid
                                        </div>
                                    ) : (
                                        <>
                                            Collect{" "}
                                            <span className="font-bold">
                                                ${order.pendingBalance}
                                            </span>
                                        </>
                                    )}
                                </Chip>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2 px-3">
                            <div className="flex items-start gap-3">
                                <div>
                                    <h3 className="font-medium">
                                        {order.customerName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground flex items-start mt-1">
                                        <MapPin className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                                        <span>{order.address.address}</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                                        <Clock className="h-4 w-4 mr-1" />
                                        <span>{format(order.date, "PPP")}</span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2 flex-row-reverse px-3">
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center"
                                    asChild
                                >
                                    <Link
                                        href={`tel:${order.customerPhone}`}
                                        target="_blank"
                                    >
                                        <Phone className="h-4 w-4 mr-1" />
                                        Call
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center"
                                    asChild
                                >
                                    <Link
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${order.address.lat},${order.address.lng}`}
                                        target="_blank"
                                    >
                                        <MapPin className="h-4 w-4 mr-1" />
                                        Navigate
                                    </Link>
                                </Button>
                            </div>
                            <Show>
                                <Show.When
                                    isTrue={order.status === "DELIVERED"}
                                >
                                    <Chip
                                        variant="light"
                                        color="success"
                                        classNames={{
                                            content: "flex items-center gap-1",
                                        }}
                                        size="lg"
                                    >
                                        <BadgeCheck className="h-4 w-4 mr-1" />
                                        Delivered
                                    </Chip>
                                </Show.When>
                                <Show.Else>
                                    <ConfirmDeliveryDrawer
                                        orderId={order._id}
                                        orderType="tiffin"
                                    />
                                </Show.Else>
                            </Show>
                        </CardFooter>
                    </Card>
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
