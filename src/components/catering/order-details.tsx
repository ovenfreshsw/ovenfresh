"use client";

import { format } from "date-fns";
import {
    BadgeCheck,
    Clock,
    Minus,
    Package2,
    Pencil,
    Plus,
    Trash2,
    Truck,
    XCircle,
} from "lucide-react";

import { Button as ShadButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@heroui/button";
import { CateringDocumentPopulate } from "@/models/types/catering";
import { updateOrderStatusAction } from "@/actions/update-order-status-action";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import OrderSettlementDialog from "../dialog/order-settlement-dialog";
import { cn } from "@/lib/utils";
import CustomerCard from "../order/customer-card";
import AddressCard from "../order/address-card";
import StoreCard from "../order/store-card";
import PaymentCard from "../order/payment-card";
import { updateOrderItemsAction } from "@/actions/update-order-items-action";
import { AddItemDrawer } from "../drawer/catering/add-item-drawer";
import Image from "next/image";

const ORDER_STATUSES = [
    "PENDING",
    "IN_PROGRESS",
    "DELIVERED",
    "CANCELLED",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

const getStatusIcon = (status: string) => {
    switch (status) {
        case "PENDING":
            return <Clock className="h-4 w-4" />;
        case "IN_PROGRESS":
            return <Truck className="h-4 w-4" />;
        case "DELIVERED":
            return <BadgeCheck className="h-4 w-4" />;
        case "CANCELLED":
            return <XCircle className="h-4 w-4" />;
        default:
            return null;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "PENDING":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
        case "IN_PROGRESS":
            return "bg-blue-100 text-blue-800 hover:bg-blue-100";
        case "DELIVERED":
            return "bg-green-100 text-green-800 hover:bg-green-100";
        case "CANCELLED":
            return "bg-red-100 text-red-800 hover:bg-red-100";
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
};

export default function CateringOrderDetails({
    orderData,
}: {
    orderData: CateringDocumentPopulate;
}) {
    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState(orderData?.status);
    const [editItems, setEditItems] = useState(false);
    const [orderItems, setOrderItems] = useState(orderData?.items);
    const [showSettlementDialog, setShowSettlementDialog] = useState(false);

    const updateOrderStatus = (newStatus: OrderStatus, settlement = false) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await updateOrderStatusAction(
                    orderData._id.toString(),
                    newStatus as OrderStatus,
                    "catering",
                    settlement
                );
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Updating order status...",
            success: () => {
                setLoading(false);
                setShowSettlementDialog(false);
                return `Order status has been updated to ${newStatus}`;
            },
            error: () => {
                setLoading(false);
                setShowSettlementDialog(false);
                return "Failed to update order status.";
            },
        });
    };

    const handleStatusUpdate = async (newStatus: string) => {
        setLoading(true);
        setOrderStatus(newStatus as OrderStatus);

        if (newStatus === "DELIVERED") {
            setShowSettlementDialog(true);
            return;
        }

        updateOrderStatus(newStatus as OrderStatus);
    };

    function decreaseQuantity(itemId: string) {
        setOrderItems((prev) =>
            prev.map((i) =>
                i.itemId._id === itemId
                    ? {
                          ...i,
                          quantity: i.quantity - 1 <= 1 ? 1 : i.quantity - 1,
                      }
                    : i
            )
        );
    }

    function increaseQuantity(itemId: string) {
        setOrderItems((prev) =>
            prev.map((i) =>
                i.itemId._id === itemId
                    ? {
                          ...i,
                          quantity: i.quantity + 1,
                      }
                    : i
            )
        );
    }

    function cancelEdit() {
        setEditItems(false);
        setOrderItems(orderData?.items);
    }

    function removeItem(itemId: string) {
        setOrderItems((prev) => prev.filter((i) => i.itemId._id !== itemId));
    }

    function saveOrderItems() {
        setEditItems(false);
        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await updateOrderItemsAction(
                    orderData._id.toString(),
                    orderItems.map((item) => ({
                        itemId: item.itemId._id,
                        quantity: item.quantity,
                        priceAtOrder: item.priceAtOrder,
                    })),
                    orderData.advancePaid,
                    orderData.tax
                );
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Updating order items...",
            success: () => {
                setLoading(false);
                return "Order items updated successfully.";
            },
            error: () => {
                setLoading(false);
                return "Failed to update order items.";
            },
        });
    }

    const existingItems = useMemo(() => {
        return orderItems.map((item) => item.itemId._id as string);
    }, [orderItems]);

    useEffect(() => {
        setOrderItems(orderData?.items);
    }, [orderData, orderData?.status]);

    useEffect(() => {
        setLoading(false);
        setOrderStatus(orderData?.status);
    }, [showSettlementDialog, orderData?.status]);

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Order {orderData.orderId}
                    </h1>
                    <div className="text-sm text-muted-foreground">
                        Created on{" "}
                        {format(
                            // @ts-expect-error: orderData type doesn't contain createdAt
                            orderData?.createdAt,
                            "MMM d, yyyy 'at' h:mm a"
                        )}{" "}
                        <Badge>Catering</Badge>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge
                        className={`flex w-fit items-center gap-1 ${getStatusColor(
                            orderData?.status
                        )}`}
                    >
                        {getStatusIcon(orderData?.status)}
                        {orderData?.status}
                    </Badge>
                    <Select
                        onValueChange={handleStatusUpdate}
                        value={orderStatus}
                    >
                        <SelectTrigger
                            className="w-[180px] text-xs h-8"
                            disabled={loading}
                        >
                            <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                            {ORDER_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-6 gap-y-6 grid-cols-1 md:grid-cols-2">
                <CustomerCard
                    customerName={orderData.customerName}
                    customerPhone={orderData.customerPhone}
                    orderId={orderData._id.toString()}
                    orderType="catering"
                    note={orderData.note}
                />

                <AddressCard
                    address={orderData.address}
                    deliveryDate={orderData.deliveryDate}
                    orderId={orderData._id.toString()}
                    orderType="catering"
                />

                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <Package2 className="h-5 w-5" />
                            Order Items
                        </CardTitle>
                        <div className="flex items-center gap-3">
                            <AddItemDrawer
                                orderId={orderData._id.toString()}
                                existingItems={existingItems}
                            />
                            <Button
                                isIconOnly
                                variant="flat"
                                radius="full"
                                size="sm"
                                onPress={() => setEditItems(true)}
                            >
                                <Pencil size={15} />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-x-scroll scrollbar-thin">
                        <Table className="min-w-[550px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-center">
                                        Qty
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Price at Order
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Current Price
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderItems.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={
                                                        item.itemId?.image ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={item.itemId.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-lg"
                                                />
                                                <div>
                                                    <div className="font-medium">
                                                        {item.itemId.name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground hidden md:block">
                                                        {
                                                            item.itemId
                                                                .description
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 items-center justify-center">
                                                <button
                                                    disabled={!editItems}
                                                    className={cn(
                                                        "justify-center items-center size-7 border rounded-md",
                                                        editItems
                                                            ? "flex"
                                                            : "hidden"
                                                    )}
                                                    onClick={() =>
                                                        decreaseQuantity(
                                                            item.itemId._id
                                                        )
                                                    }
                                                >
                                                    <Minus className="size-3" />
                                                </button>
                                                {item?.quantity}
                                                <button
                                                    disabled={!editItems}
                                                    className={cn(
                                                        "justify-center items-center size-7 border rounded-md",
                                                        editItems
                                                            ? "flex"
                                                            : "hidden"
                                                    )}
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            item.itemId._id
                                                        )
                                                    }
                                                >
                                                    <Plus className="size-3" />
                                                </button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ${item?.priceAtOrder.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ${item.itemId.price}
                                            {item.itemId.price !==
                                                item?.priceAtOrder && (
                                                <Badge
                                                    variant="outline"
                                                    className="ml-2"
                                                >
                                                    {item.itemId.price >
                                                    item?.priceAtOrder
                                                        ? "Increased"
                                                        : "Decreased"}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <ShadButton
                                                size="icon"
                                                variant="ghost"
                                                disabled={!editItems}
                                                onClick={() =>
                                                    removeItem(item.itemId._id)
                                                }
                                            >
                                                <Trash2 size={16} />
                                            </ShadButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex justify-end items-center gap-2 mt-3">
                            <ShadButton
                                disabled={!editItems}
                                variant={"ghost"}
                                size={"sm"}
                                onClick={cancelEdit}
                            >
                                Cancel
                            </ShadButton>
                            <ShadButton
                                onClick={saveOrderItems}
                                disabled={!editItems || loading}
                                size={"sm"}
                            >
                                Save
                            </ShadButton>
                        </div>
                    </CardContent>
                </Card>

                <StoreCard store={orderData.store} />

                <PaymentCard
                    advancePaid={orderData.advancePaid}
                    fullyPaid={orderData.fullyPaid}
                    orderId={orderData._id.toString()}
                    orderType="catering"
                    paymentMethod={orderData.paymentMethod}
                    pendingBalance={orderData.pendingBalance}
                    tax={orderData.tax}
                    totalPrice={orderData.totalPrice}
                />
            </div>
            <OrderSettlementDialog
                open={showSettlementDialog}
                setOpen={setShowSettlementDialog}
                updateOrderStatus={updateOrderStatus}
            />
        </div>
    );
}
