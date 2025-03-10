"use client";

import { useDeliveryOrders } from "@/api-hooks/delivery/get-delivery-order";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
    BadgeCheck,
    Camera,
    Check,
    Loader2,
    MapPin,
    Phone,
} from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Chip } from "@heroui/chip";
import { ConfirmDeliveryDrawer } from "../drawer/delivery/confirm-delivery-drawer";
import { Show } from "../show";
import Upload from "../upload/upload";
import { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import OrderItemsDrawer from "../drawer/delivery/order-items-drawer";

const SortedOrderList = ({
    status,
    orderType,
}: {
    status: string;
    orderType: "tiffin" | "catering";
}) => {
    const { data, isPending } = useDeliveryOrders(orderType);
    const [resource, setResource] = useState<
        string | CloudinaryUploadWidgetInfo | undefined
    >();

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
                    <Card className="w-full max-w-md mx-auto" key={order._id}>
                        <CardHeader className="pb-2 px-3 pt-3">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-lg">
                                    {order.orderId}
                                </p>
                                <Badge
                                    variant={
                                        order.status === "DELIVERED"
                                            ? "outline"
                                            : "secondary"
                                    }
                                    className="ml-auto"
                                >
                                    {order.status === "DELIVERED"
                                        ? "Delivered"
                                        : "Pending"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2 px-3 space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarFallback>
                                        {order.customerName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">
                                        {order.customerName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(order.date), "PPP")}
                                    </p>
                                </div>
                                <Show>
                                    <Show.When
                                        isTrue={orderType === "catering"}
                                    >
                                        <OrderItemsDrawer
                                            items={order.items || []}
                                            orderId={order.orderId}
                                        />
                                    </Show.When>
                                </Show>
                            </div>

                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                                <p className="text-sm">
                                    {order.address.address}
                                </p>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Payment Status
                                    </p>
                                    <p className="font-medium">
                                        {order.fullyPaid
                                            ? "Paid"
                                            : `Collect $${order.pendingBalance}`}
                                    </p>
                                </div>
                                <Show>
                                    <Show.When
                                        isTrue={order.status !== "DELIVERED"}
                                    >
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className={`rounded-full ${
                                                    resource !== undefined
                                                        ? "bg-green-100 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-600"
                                                        : ""
                                                }`}
                                            >
                                                {resource !== undefined ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <Upload
                                                        folder={`${orderType}/${order.orderId}`}
                                                        setResource={
                                                            setResource
                                                        }
                                                    >
                                                        <Camera className="h-4 w-4" />
                                                    </Upload>
                                                )}
                                            </Button>
                                        </div>
                                    </Show.When>
                                </Show>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2 pt-0 px-3">
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
                                        className="flex-1 max-w-full"
                                    >
                                        <BadgeCheck className="h-4 w-4 mr-1" />
                                        Delivered
                                    </Chip>
                                </Show.When>
                                <Show.Else>
                                    <ConfirmDeliveryDrawer
                                        orderId={order._id}
                                        orderType={orderType}
                                        pendingBalance={order.pendingBalance}
                                        disabled={!resource}
                                        resource={resource}
                                    />
                                </Show.Else>
                            </Show>
                            <Button variant="outline" size="icon" asChild>
                                <Link
                                    href={`tel:${order.customerPhone}`}
                                    target="_blank"
                                >
                                    <Phone className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="icon" asChild>
                                <Link
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${order.address.lat},${order.address.lng}`}
                                    target="_blank"
                                >
                                    <MapPin className="h-4 w-4" />
                                </Link>
                            </Button>
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
