"use client";

import {
    CateringDocument,
    CateringDocumentPopulate,
} from "@/models/types/catering";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import { Eye, Loader2 } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useCateringOrders } from "@/api-hooks/catering/get-catering-orders";
import { formatDate } from "@/lib/utils";
import { ObjectId } from "mongoose";
import { CustomerDocument } from "@/models/types/customer";
import { Chip, ChipProps } from "@heroui/chip";

type CellValue = Array<
    | string
    | number
    | boolean
    | ObjectId
    | CustomerDocument
    | {
          itemId: string;
          priceAtOrder: number;
          quantity: number;
      }[]
    | Date
>;

export const columns = [
    { name: "ID", uid: "orderId", sortable: true },
    { name: "CUSTOMER", uid: "customerName" },
    { name: "PHONE", uid: "customerPhone" },
    { name: "CREATED AT", uid: "createdAt" },
    { name: "DELIVERY DATE", uid: "deliveryDate", sortable: true },
    { name: "TOTAL", uid: "totalPrice" },
    { name: "STATUS", uid: "status", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
    { name: "Pending", uid: "pending" },
    { name: "Ongoing", uid: "ongoing" },
    { name: "Delivered", uid: "delivered" },
    { name: "Cancelled", uid: "cancelled" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
    DELIVERED: "success",
    CANCELLED: "danger",
    PENDING: "warning",
    ONGOING: "primary",
};

const RecentCateringOrderTable = () => {
    const { data: orders, isPending } = useCateringOrders(10);

    const renderCell = React.useCallback(
        (order: CateringDocument, columnKey: React.Key) => {
            const cellValue = order[columnKey as keyof CateringDocument];

            switch (columnKey) {
                case "createdAt":
                    return <p>{formatDate(new Date(cellValue as string))}</p>;
                case "deliveryDate":
                    return <p>{formatDate(new Date(cellValue as string))}</p>;
                case "items":
                    return (
                        <p className="text-center">
                            {(cellValue as unknown as CellValue)?.length}
                        </p>
                    );
                case "totalPrice":
                    return `$${cellValue}`;
                case "status":
                    return (
                        <Chip
                            className="capitalize"
                            color={statusColorMap[order.status]}
                            size="sm"
                            variant="flat"
                        >
                            {cellValue?.toString()}
                        </Chip>
                    );
                case "actions":
                    return (
                        <div className="flex gap-2.5 items-center justify-center">
                            <Link href={`orders/catering-${order.orderId}`}>
                                <Eye
                                    size={18}
                                    className="stroke-2 text-muted-foreground"
                                />
                            </Link>
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        []
    );

    return (
        <Table
            isHeaderSticky
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px] scrollbar-none border shadow-md px-3",
            }}
            topContent={
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-medium">
                        Recent Catering Orders
                    </h1>
                    <Button size={"sm"} asChild>
                        <Link href="/dashboard/orders">View all</Link>
                    </Button>
                </div>
            }
            topContentPlacement="inside"
        >
            <TableHeader columns={columns}>
                {(column: {
                    uid: string;
                    sortable?: boolean;
                    name: string;
                }) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={"No orders found"}
                isLoading={isPending}
                items={orders || []}
                loadingContent={<Loader2 className="animate-spin" />}
            >
                {(item: CateringDocumentPopulate) => (
                    <TableRow key={item._id.toString()}>
                        {(columnKey) => (
                            <TableCell>
                                {/* @ts-expect-error: renderCell doesn't take CateringDocPopulate type */}
                                {renderCell(item, columnKey)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default RecentCateringOrderTable;
