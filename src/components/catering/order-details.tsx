"use client";

import { format } from "date-fns";
import {
    BadgeCheck,
    Clock,
    ImageIcon,
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
import {
    CateringDocument,
    CateringDocumentPopulate,
} from "@/models/types/catering";
import { updateOrderStatusAction } from "@/actions/update-order-status-action";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo, useState } from "react";
import OrderSettlementDialog from "../dialog/order-settlement-dialog";
import { appendBracket, cn } from "@/lib/utils";
import CustomerCard from "../order/customer-card";
import AddressCard from "../order/address-card";
import StoreCard from "../order/store-card";
import PaymentCard from "../order/payment-card";
import { updateOrderItemsAction } from "@/actions/update-order-items-action";
import { AddItemDrawer } from "../drawer/catering/add-item-drawer";
import Image from "next/image";
import { ORDER_STATUSES, OrderStatus } from "@/lib/types/order-status";
import { Show } from "../show";
import SizeSelect from "../select/size-select";
import { Input } from "../ui/input";
import AddCustomItemDirectDialog from "../dialog/add-custom-item-direct";
import { sentOrderToWhatsappAction } from "@/actions/sent-order-to-whatsapp-action";
import LoadingButton from "../ui/loading-button";
import Whatsapp from "../icons/whatsapp";

const getStatusIcon = (status: string) => {
    switch (status) {
        case "PENDING":
            return <Clock className="h-4 w-4" />;
        case "ONGOING":
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
        case "ONGOING":
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
    const [editCustomItems, setEditCustomItems] = useState(false);
    const [orderItems, setOrderItems] = useState(orderData?.items);
    const [customItems, setCustomItems] = useState(orderData?.customItems);
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

    function decreaseQuantity(itemId: string, size: string) {
        setOrderItems((prev) =>
            prev.map((i) =>
                i.itemId._id === itemId && i.size === size
                    ? {
                          ...i,
                          quantity: i.quantity - 1 <= 1 ? 1 : i.quantity - 1,
                      }
                    : i
            )
        );
    }

    function increaseQuantity(itemId: string, size: string) {
        setOrderItems((prev) =>
            prev.map((i) =>
                i.itemId._id === itemId && i.size === size
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

    function cancelCustomEdit() {
        setEditCustomItems(false);
        setCustomItems(orderData?.customItems);
    }

    function removeItem(itemId: string, size: string) {
        setOrderItems((prev) =>
            prev.filter((i) => !(i.itemId._id === itemId && i.size === size))
        );
    }

    function removeCustomItem(name: string) {
        setCustomItems((prev) => prev.filter((i) => !(i.name === name)));
    }

    function saveOrderItems(itemType: "items" | "customItems") {
        let updatedItem:
            | CateringDocument["items"]
            | CateringDocument["customItems"];
        if (itemType === "items") {
            setEditItems(false);
            updatedItem = orderItems.map((item) => ({
                itemId: item.itemId._id,
                quantity: item.quantity,
                priceAtOrder: item.priceAtOrder,
                size: item.size,
            }));
        } else {
            setEditCustomItems(false);
            updatedItem = customItems.map((item) => ({
                name: item.name,
                size: item.size,
                priceAtOrder: item.priceAtOrder,
            }));
        }

        const subtotal =
            orderItems.reduce(
                (acc, item) => acc + item.priceAtOrder * item.quantity,
                0
            ) + customItems.reduce((acc, item) => acc + item.priceAtOrder, 0);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await updateOrderItemsAction(
                    orderData._id.toString(),
                    itemType,
                    updatedItem,
                    orderData.advancePaid,
                    orderData.tax,
                    orderData.deliveryCharge,
                    subtotal,
                    orderData.discount
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
            error: (error) => {
                setLoading(false);
                console.log(error);
                return "Failed to update order items.";
            },
        });
    }

    function handleCustomItemUpdate(
        check: string,
        key: string,
        value: string | number
    ) {
        setCustomItems((prev) =>
            prev.map((i) => {
                // @ts-expect-error: item._id is a string
                return i._id === check ? { ...i, [key]: value } : i;
            })
        );
    }

    const handleSentToWhatsapp = useCallback(async () => {
        try {
            setLoading(true);
            await sentOrderToWhatsappAction(
                orderData._id.toString(),
                "catering"
            );
            toast.success("Order sent to Whatsapp.");
        } catch (error) {
            toast.error("Failed to send order to Whatsapp.");
        } finally {
            setLoading(false);
        }
    }, [orderData?._id.toString()]);

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

    useEffect(() => {
        if (customItems.length === 0) setEditCustomItems(false);
    }, [customItems]);

    return (
        <div className="py-10 px-2.5">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Order {orderData.orderId}
                    </h1>
                    <div className="text-sm text-muted-foreground">
                        Created on{" "}
                        {format(
                            orderData?.createdAt,
                            "MMM d, yyyy 'at' h:mm a"
                        )}{" "}
                        <Badge>Catering</Badge>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <LoadingButton
                        isLoading={loading}
                        size={"sm"}
                        onClick={handleSentToWhatsapp}
                        variant="outline"
                        className="border-green-200 mr-2 text-green-500 hover:bg-green-100 hover:text-green-500 flex items-center gap-2"
                    >
                        <Whatsapp /> Sent to Whatsapp
                    </LoadingButton>
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
                    order_type={orderData.order_type}
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
                                    <TableHead className="text-center">
                                        Size
                                    </TableHead>
                                    <TableHead className="text-right whitespace-nowrap">
                                        Price at Order
                                    </TableHead>
                                    <TableHead className="text-right whitespace-nowrap">
                                        Current Price
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderItems.map((item) => (
                                    <TableRow key={item.itemId._id + item.size}>
                                        <TableCell className="whitespace-nowrap min-w-64">
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
                                                <div className="font-medium">
                                                    {appendBracket(
                                                        item.itemId.name,
                                                        item.itemId.variant
                                                    )}
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
                                                            item.itemId._id,
                                                            item.size
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
                                                            item.itemId._id,
                                                            item.size
                                                        )
                                                    }
                                                >
                                                    <Plus className="size-3" />
                                                </button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right capitalize whitespace-nowrap">
                                            <Show>
                                                <Show.When isTrue={editItems}>
                                                    <SizeSelect
                                                        defaultSize={item.size}
                                                        itemId={item.itemId._id}
                                                        setOrderItems={
                                                            setOrderItems
                                                        }
                                                        menu={item.itemId}
                                                    />
                                                </Show.When>
                                                <Show.Else>
                                                    {appendBracket(
                                                        item?.size,
                                                        item.itemId[
                                                            `${
                                                                item?.size as "small"
                                                            }ServingSize`
                                                        ]
                                                    )}
                                                </Show.Else>
                                            </Show>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ${item?.priceAtOrder.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            $
                                            {
                                                item.itemId[
                                                    `${item?.size}Price` as "smallPrice"
                                                ]
                                            }
                                            {item.itemId[
                                                `${item?.size}Price` as "smallPrice"
                                            ] !== item?.priceAtOrder && (
                                                <Badge
                                                    variant="outline"
                                                    className="ml-2"
                                                >
                                                    {item.itemId[
                                                        `${item?.size}Price` as "smallPrice"
                                                    ] || 0 > item?.priceAtOrder
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
                                                    removeItem(
                                                        item.itemId._id,
                                                        item.size
                                                    )
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
                                onClick={() => saveOrderItems("items")}
                                disabled={!editItems || loading}
                                size={"sm"}
                            >
                                Save
                            </ShadButton>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <Package2 className="h-5 w-5" />
                            Custom Order Items
                        </CardTitle>
                        <div className="flex items-center gap-3">
                            <AddCustomItemDirectDialog
                                setCustomItems={setCustomItems}
                                enableSaveButton={setEditCustomItems}
                            >
                                <Button
                                    isIconOnly
                                    variant="flat"
                                    radius="full"
                                    size="sm"
                                >
                                    <Plus size={15} />
                                </Button>
                            </AddCustomItemDirectDialog>
                            <Button
                                isIconOnly
                                variant="flat"
                                radius="full"
                                size="sm"
                                onPress={() => setEditCustomItems(true)}
                            >
                                <Pencil size={15} />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-x-scroll scrollbar-thin">
                        <Show>
                            <Show.When isTrue={customItems?.length === 0}>
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <span>No custom items added yet.</span>
                                    <AddCustomItemDirectDialog
                                        setCustomItems={setCustomItems}
                                        enableSaveButton={setEditCustomItems}
                                    >
                                        <ShadButton
                                            size={"sm"}
                                            className="flex items-center gap-2"
                                        >
                                            <Plus />
                                            Add custom items
                                        </ShadButton>
                                    </AddCustomItemDirectDialog>
                                </div>
                            </Show.When>
                            <Show.Else>
                                <Table className="min-w-[550px]">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead className="text-center">
                                                Size
                                            </TableHead>
                                            <TableHead className="text-right whitespace-nowrap">
                                                Price at Order
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customItems?.map((item) => (
                                            // @ts-expect-error: item._id is a string
                                            <TableRow key={item._id}>
                                                <TableCell className="whitespace-nowrap min-w-64">
                                                    <div className="flex items-center gap-3">
                                                        <div className="rounded-lg size-12 bg-gray-200 flex justify-center items-center flex-shrink-0">
                                                            <ImageIcon
                                                                size={15}
                                                            />
                                                        </div>
                                                        <Show>
                                                            <Show.When
                                                                isTrue={
                                                                    editCustomItems
                                                                }
                                                            >
                                                                <Input
                                                                    value={
                                                                        item.name
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        handleCustomItemUpdate(
                                                                            // @ts-expect-error: item._id is a string
                                                                            item._id,
                                                                            "name",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                    placeholder="Item name"
                                                                    className="w-36"
                                                                />
                                                            </Show.When>
                                                            <Show.Else>
                                                                <div className="font-medium">
                                                                    {item.name}
                                                                </div>
                                                            </Show.Else>
                                                        </Show>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right capitalize whitespace-nowrap">
                                                    <Show>
                                                        <Show.When
                                                            isTrue={
                                                                editCustomItems
                                                            }
                                                        >
                                                            <Input
                                                                value={
                                                                    item.size
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    handleCustomItemUpdate(
                                                                        // @ts-expect-error: item._id is a string
                                                                        item._id,
                                                                        "size",
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                                placeholder="Size"
                                                                className="w-20 ms-auto"
                                                            />
                                                        </Show.When>
                                                        <Show.Else>
                                                            {item?.size}
                                                        </Show.Else>
                                                    </Show>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Show>
                                                        <Show.When
                                                            isTrue={
                                                                editCustomItems
                                                            }
                                                        >
                                                            <Input
                                                                value={
                                                                    item.priceAtOrder
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    handleCustomItemUpdate(
                                                                        // @ts-expect-error: item._id is a string
                                                                        item._id,
                                                                        "priceAtOrder",
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    );
                                                                }}
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                placeholder="Price"
                                                                className="w-16 ms-auto"
                                                            />
                                                        </Show.When>
                                                        <Show.Else>
                                                            $
                                                            {item?.priceAtOrder.toFixed(
                                                                2
                                                            )}
                                                        </Show.Else>
                                                    </Show>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <ShadButton
                                                        size="icon"
                                                        variant="ghost"
                                                        disabled={
                                                            !editCustomItems
                                                        }
                                                        onClick={() =>
                                                            removeCustomItem(
                                                                item.name
                                                            )
                                                        }
                                                    >
                                                        <Trash2 size={16} />
                                                    </ShadButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Show.Else>
                        </Show>
                        <div className="flex justify-end items-center gap-2 mt-3">
                            <ShadButton
                                disabled={!editCustomItems}
                                variant={"ghost"}
                                size={"sm"}
                                onClick={cancelCustomEdit}
                            >
                                Cancel
                            </ShadButton>
                            <ShadButton
                                onClick={() => saveOrderItems("customItems")}
                                disabled={!editCustomItems || loading}
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
                    discount={orderData.discount || 0}
                    tax={orderData.tax}
                    deliveryCharge={orderData.deliveryCharge}
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
