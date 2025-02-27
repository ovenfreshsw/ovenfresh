"use client";

import { format } from "date-fns";
import {
    BadgeCheck,
    Clock,
    Package2,
    Pencil,
    Truck,
    X,
    XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateOrderStatusAction } from "@/actions/update-order-status-action";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import OrderSettlementDialog from "../dialog/order-settlement-dialog";
import CustomerCard from "../order/customer-card";
import AddressCard from "../order/address-card";
import StoreCard from "../order/store-card";
import PaymentCard from "../order/payment-card";
import { TiffinDocumentPopulate } from "@/models/types/tiffin";
import EditTiffinOrderDialog from "../dialog/edit-tiffin-order-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Button as HeroButton } from "@heroui/button";
import { updateDayOrderStatusAction } from "@/actions/update-day-order-status-action";

const ORDER_STATUSES = [
    "PENDING",
    "ONGOING",
    "DELIVERED",
    "CANCELLED",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

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

export default function TiffinOrderDetails({
    orderData,
}: {
    orderData: TiffinDocumentPopulate;
}) {
    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState(orderData?.status);
    const [showSettlementDialog, setShowSettlementDialog] = useState(false);
    const [editDayStatus, setEditDayStatus] = useState(false);
    const [dayStatusChange, setDayStatusChange] = useState<
        { _id: string; status: Exclude<OrderStatus, "CANCELLED"> }[]
    >([]);

    const updateOrderStatus = (newStatus: OrderStatus, settlement = false) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await updateOrderStatusAction(
                    orderData._id.toString(),
                    newStatus as OrderStatus,
                    "tiffin",
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

    const saveDayStatus = () => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await updateDayOrderStatusAction(
                    orderData._id.toString(),
                    dayStatusChange
                );
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Updating order status...",
            success: () => {
                setLoading(false);
                setEditDayStatus(false);
                return `Order status has been updated`;
            },
            error: () => {
                setLoading(false);
                setEditDayStatus(false);
                return "Failed to update order status.";
            },
        });
    };

    const handleStatusUpdate = async (newStatus: string) => {
        setLoading(true);

        if (newStatus === "DELIVERED") {
            setShowSettlementDialog(true);
            return;
        }

        updateOrderStatus(newStatus as OrderStatus);
    };

    function handleDayStatusChange(
        _id: string,
        status: Exclude<OrderStatus, "CANCELLED">
    ) {
        setDayStatusChange((prev) => {
            const existingIndex = prev.findIndex((item) => item._id === _id);
            if (existingIndex !== -1) {
                // Update existing item
                const updatedArray = [...prev];
                updatedArray[existingIndex] = { _id, status };
                return updatedArray;
            } else {
                // Add new item
                return [...prev, { _id, status }];
            }
        });
    }

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
                            orderData?.createdAt,
                            "MMM d, yyyy 'at' h:mm a"
                        )}{" "}
                        <Badge>Tiffin</Badge>
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
                    orderType="tiffin"
                    note={orderData.note}
                />

                <AddressCard
                    address={orderData.address}
                    startDate={orderData.startDate}
                    endDate={orderData.endDate}
                    orderId={orderData._id.toString()}
                    orderType="tiffin"
                    numberOfWeeks={orderData.numberOfWeeks}
                />

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center space-y-0 justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Package2 className="h-5 w-5" />
                                Order Details
                            </CardTitle>
                            <div className="flex items-center gap-3">
                                <EditTiffinOrderDialog
                                    numberOfWeeks={orderData.numberOfWeeks}
                                    orderId={orderData._id.toString()}
                                    type={orderData.order_type}
                                    startDate={orderData.startDate}
                                    tax={orderData.tax}
                                    advancePaid={orderData.advancePaid}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2 text-sm">
                                    Order Type:{" "}
                                    <span className="capitalize font-semibold">
                                        {orderData.order_type}
                                    </span>
                                </div>
                                <div>
                                    Number of weeks:{" "}
                                    <span className="capitalize font-semibold">
                                        {orderData.numberOfWeeks}
                                    </span>
                                </div>
                                <div>
                                    Order extended:{" "}
                                    <span className="capitalize font-semibold">
                                        {orderData.extended ? "Yes" : "No"}
                                    </span>
                                </div>
                                {orderData.extendedFrom.length > 0 && (
                                    <div>
                                        Order extended from:{" "}
                                        <span className="capitalize font-semibold">
                                            {orderData.extendedFrom.map(
                                                (item, i) => (
                                                    <b key={i}>
                                                        {item}
                                                        {", "}
                                                    </b>
                                                )
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <StoreCard store={orderData.store} />
                </div>

                <PaymentCard
                    advancePaid={orderData.advancePaid}
                    fullyPaid={orderData.fullyPaid}
                    orderId={orderData._id.toString()}
                    orderType="tiffin"
                    paymentMethod={orderData.paymentMethod}
                    pendingBalance={orderData.pendingBalance}
                    tax={orderData.tax}
                    deliveryCharge={0}
                    totalPrice={orderData.totalPrice}
                />

                <Card className="col-span-2">
                    <CardHeader className="flex flex-row items-center space-y-0 justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Package2 className="h-5 w-5" />
                            Order Summary
                        </CardTitle>
                        <div className="flex items-center gap-3">
                            <HeroButton
                                isIconOnly
                                variant="flat"
                                radius="full"
                                size="sm"
                                onPress={() =>
                                    setEditDayStatus((prev) => !prev)
                                }
                            >
                                {editDayStatus ? (
                                    <X size={15} />
                                ) : (
                                    <Pencil size={15} />
                                )}
                            </HeroButton>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-x-scroll scrollbar-thin">
                        <Table className="min-w-[550px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">
                                        Status
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Update status
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderData?.individualStatus.map(
                                    (status, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                {format(
                                                    new Date(status.date),
                                                    "EEEE, MMMM do, yyyy"
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    className={`gap-1 ${getStatusColor(
                                                        status.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(
                                                        status.status
                                                    )}
                                                    {status.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right w-[220px]">
                                                <Select
                                                    defaultValue={status.status}
                                                    onValueChange={(
                                                        value: Exclude<
                                                            OrderStatus,
                                                            "CANCELLED"
                                                        >
                                                    ) =>
                                                        handleDayStatusChange(
                                                            status._id,
                                                            value
                                                        )
                                                    }
                                                    disabled={!editDayStatus}
                                                >
                                                    <SelectTrigger
                                                        id="status"
                                                        className="w-[220px] ms-auto"
                                                    >
                                                        <SelectValue placeholder="Select a status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="PENDING">
                                                            PENDING
                                                        </SelectItem>
                                                        <SelectItem value="ONGOING">
                                                            ONGOING
                                                        </SelectItem>
                                                        <SelectItem value="DELIVERED">
                                                            DELIVERED
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                        <div className="flex justify-end items-center gap-2 mt-3">
                            <Button
                                disabled={!editDayStatus}
                                variant={"ghost"}
                                size={"sm"}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={saveDayStatus}
                                disabled={!editDayStatus || loading}
                                size={"sm"}
                            >
                                Save
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <OrderSettlementDialog
                open={showSettlementDialog}
                setOpen={setShowSettlementDialog}
                updateOrderStatus={updateOrderStatus}
            />
        </div>
    );
}
