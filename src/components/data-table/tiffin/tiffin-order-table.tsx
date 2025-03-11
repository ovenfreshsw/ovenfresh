"use client";

import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Selection,
} from "@heroui/table";
import {
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
} from "@heroui/dropdown";
import { Pagination } from "@heroui/pagination";
import { Chip, ChipProps } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
    Banknote,
    CreditCard,
    Eye,
    ListFilter,
    Loader2,
    PlusCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { TiffinDocument, TiffinDocumentPopulate } from "@/models/types/tiffin";
import Link from "next/link";
import { DeleteOrderDrawer } from "../../drawer/delete-order-drawer";
import { DatePickerWithRange } from "../../date-range-picker";
import { format } from "date-fns";
import ExportToExcel from "@/components/csv/export-to-excel";
import { Show } from "@/components/show";
import { useSession } from "next-auth/react";

export function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const columns = [
    { name: "ID", uid: "_id", sortable: true },
    { name: "CUSTOMER", uid: "customerName" },
    { name: "PHONE", uid: "customerPhone" },
    { name: "START DATE", uid: "startDate", sortable: true },
    { name: "END DATE", uid: "endDate", sortable: true },
    { name: "NO. OF WEEKS", uid: "numberOfWeeks" },
    { name: "PAYMENT METHOD", uid: "paymentMethod" },
    { name: "ADVANCE PAID", uid: "advancePaid" },
    { name: "PENDING BALANCE", uid: "pendingBalance" },
    { name: "TAX", uid: "tax" },
    { name: "TOTAL", uid: "totalPrice" },
    { name: "FULLY PAID", uid: "fullyPaid" },
    { name: "ORDER TYPE", uid: "order_type" },
    { name: "NOTE", uid: "note" },
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

const INITIAL_VISIBLE_COLUMNS = [
    "customerName",
    "startDate",
    "endDate",
    "numberOfWeeks",
    "status",
    "actions",
];

export default function TiffinOrderTable({
    orders,
    isPending,
}: {
    isPending: boolean;
    orders: TiffinDocumentPopulate[];
}) {
    const session = useSession();
    const userRole = session.data?.user.role;

    const [filterValue, setFilterValue] = React.useState("");
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredOrders = [...orders];

        if (hasSearchFilter) {
            filteredOrders = filteredOrders.filter(
                (order) =>
                    order.customerName
                        .toLowerCase()
                        .includes(filterValue.toLowerCase()) ||
                    order.customerPhone.includes(filterValue)
            );
        }
        if (
            statusFilter !== "all" &&
            Array.from(statusFilter).length !== statusOptions.length
        ) {
            filteredOrders = filteredOrders.filter((order) =>
                Array.from(statusFilter).includes(order.status.toLowerCase())
            );
        }

        return filteredOrders;
    }, [orders, filterValue, statusFilter, hasSearchFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => [...items], [items]);

    const renderCell = React.useCallback(
        (order: TiffinDocument, columnKey: React.Key) => {
            const cellValue = order[columnKey as keyof TiffinDocument];

            switch (columnKey) {
                case "startDate":
                    return <p>{formatDate(new Date(cellValue as string))}</p>;
                case "endDate":
                    return <p>{formatDate(new Date(cellValue as string))}</p>;
                case "paymentMethod":
                    return (
                        <p className="capitalize flex items-center gap-1 text-sm justify-center">
                            {cellValue?.toString() === "cash" ? (
                                <Banknote
                                    size={17}
                                    className="text-muted-foreground"
                                />
                            ) : (
                                <CreditCard
                                    size={17}
                                    className="text-muted-foreground"
                                />
                            )}
                            {cellValue?.toString()}
                        </p>
                    );
                case "advancePaid":
                    return <p className="text-center">{`$${cellValue}`}</p>;
                case "pendingBalance":
                    return <p className="text-center">{`$${cellValue}`}</p>;
                case "tax":
                    return <p className="text-center">{`$${cellValue}`}</p>;
                case "totalPrice":
                    return `$${cellValue}`;
                case "numberOfWeeks":
                    return (
                        <p className="text-center">{cellValue?.toString()}</p>
                    );
                case "fullyPaid":
                    return (
                        <Chip
                            color={Boolean(cellValue) ? "success" : "warning"}
                            size="sm"
                            variant="flat"
                            className="capitalize"
                        >
                            {Boolean(cellValue) ? "Yes" : "No"}
                        </Chip>
                    );
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
                            <Link
                                href={`/dashboard/orders/tiffin-${
                                    order.orderId
                                }?mid=${order._id.toString()}`}
                            >
                                <Eye
                                    size={18}
                                    className="stroke-2 text-muted-foreground"
                                />
                            </Link>
                            <DeleteOrderDrawer
                                orderId={order._id.toString()}
                                orderType="tiffin"
                            />
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        []
    );

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
        },
        []
    );

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const excelData = React.useMemo(() => {
        if (userRole === "SUPERADMIN" || userRole === "ADMIN") {
            return orders.map((order) => ({
                orderId: order.orderId,
                customerName: order.customerName,
                phone: order.customerPhone,
                address: order.address.address,
                startDate: format(new Date(order.startDate), "PPP"),
                endDate: format(new Date(order.endDate), "PPP"),
                numberOfWeeks: order.numberOfWeeks,
                orderType: order.order_type,
                paymentMethod: order.paymentMethod,
                totalAmount: order.totalPrice - order.tax,
                tax: order.tax,
                fullyPaid: order.fullyPaid ? "Yes" : "No",
                status: order.status,
                note: order.note,
                orderPlaced: format(new Date(order.createdAt), "PPP"),
                store: order.store.location,
            }));
        }
        return [];
    }, [orders, userRole]); // Added userRole in the dependency array to re-run when it changes

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex gap-3 items-end flex-wrap">
                    <Input
                        isClearable
                        className="md:max-w-80"
                        classNames={{
                            inputWrapper: "rounded-md bg-white border h-9",
                        }}
                        size="sm"
                        placeholder="Search by name or phone number..."
                        startContent={
                            <ListFilter
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                                className="text-muted-foreground"
                            />
                        }
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3 items-end">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    startContent={
                                        <PlusCircle className="h-4 w-4" />
                                    }
                                    size="sm"
                                    variant="bordered"
                                    className="rounded-md bg-white border border-dashed shadow-sm h-9"
                                >
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem
                                        key={status.uid}
                                        className="capitalize"
                                    >
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    startContent={
                                        <PlusCircle className="h-4 w-4" />
                                    }
                                    size="sm"
                                    variant="bordered"
                                    className="rounded-md bg-white border border-dashed shadow-sm h-9"
                                >
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                                className="max-h-96 overflow-y-scroll scrollbar-thin"
                            >
                                {columns.map((column) => (
                                    <DropdownItem
                                        key={column.uid}
                                        className="capitalize"
                                    >
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="flex-1 flex justify-end gap-2">
                        <Show>
                            <Show.When
                                isTrue={
                                    userRole === "ADMIN" ||
                                    userRole === "SUPERADMIN"
                                }
                            >
                                <ExportToExcel
                                    filename="tiffin-orders.xlsx"
                                    data={excelData}
                                />
                            </Show.When>
                        </Show>
                        <DatePickerWithRange
                            orderType="tiffin"
                            label="Print Report"
                            printType="summary"
                            disabled={orders.length === 0}
                        />
                        <DatePickerWithRange
                            orderType="tiffin"
                            printType="sticker"
                            label="Print Stickers"
                            disabled={orders.length === 0}
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {orders?.length} orders
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        orders?.length,
        excelData,
        userRole,
        onClear,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onPreviousPage}
                    >
                        Previous
                    </Button>
                    <Button
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onNextPage}
                    >
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [
        // items.length,
        // hasSearchFilter,
        page,
        pages,
        onNextPage,
        onPreviousPage,
    ]);

    return (
        <Table
            isHeaderSticky
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px] scrollbar-none border shadow-md px-3",
            }}
            topContent={topContent}
            topContentPlacement="outside"
        >
            <TableHeader columns={headerColumns}>
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
                items={sortedItems}
                isLoading={isPending}
                loadingContent={<Loader2 className="animate-spin" />}
            >
                {(item: TiffinDocumentPopulate) => (
                    <TableRow key={item._id}>
                        {(columnKey) => (
                            <TableCell>
                                {/* @ts-expect-error: renderCell doesn't take TiffinDocPopulate type */}
                                {renderCell(item, columnKey)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
