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
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { ListFilter, Loader2, PlusCircle } from "lucide-react";
import { PendingDetailsProps } from "@/lib/types/finance";
import Link from "next/link";
import { format } from "date-fns";

export const columns = [
    { name: "ID", uid: "orderId" },
    { name: "CUSTOMER", uid: "customerName" },
    { name: "STORE", uid: "store" },
    { name: "ORDER", uid: "order" },
    { name: "DUE DATE", uid: "due" },
    { name: "PENDING BALANCE", uid: "pendingBalance" },
];

const orderOptions = [
    { name: "Catering", uid: "catering" },
    { name: "Tiffin", uid: "tiffin" },
];

export default function PendingPaymentsTable({
    data,
    isPending,
}: {
    isPending: boolean;
    data: PendingDetailsProps[];
}) {
    const [orderFilter, setOrderFilter] = React.useState<Selection>("all");
    const [filterValue, setFilterValue] = React.useState("");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredDetails = [...data];

        if (hasSearchFilter) {
            filteredDetails = filteredDetails.filter(
                (detail) =>
                    detail.customerName
                        .toLowerCase()
                        .includes(filterValue.toLowerCase()) ||
                    detail.orderId.includes(filterValue)
            );
        }
        if (
            orderFilter !== "all" &&
            Array.from(orderFilter).length !== orderOptions.length
        ) {
            filteredDetails = filteredDetails.filter((detail) =>
                Array.from(orderFilter).includes(detail.order.toLowerCase())
            );
        }

        return filteredDetails;
    }, [data, filterValue, orderFilter, hasSearchFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const renderCell = React.useCallback(
        (order: PendingDetailsProps, columnKey: React.Key) => {
            const cellValue = order[columnKey as keyof PendingDetailsProps];

            switch (columnKey) {
                case "orderId":
                    return (
                        <Link
                            className="hover:underline"
                            href={`/dashboard/orders/${order.order}-${order.orderId}?mid=${order._id}`}
                        >
                            {cellValue as string}
                        </Link>
                    );
                case "order":
                    return (cellValue as string).toUpperCase();
                case "due":
                    return format(new Date(cellValue as string), "MMM d, yyyy");
                case "pendingBalance":
                    return `$${cellValue as number}`;
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
                                    Order Type
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Order Type"
                                closeOnSelect={false}
                                selectedKeys={orderFilter}
                                selectionMode="multiple"
                                onSelectionChange={setOrderFilter}
                                className="max-h-96 overflow-y-scroll scrollbar-thin"
                            >
                                {orderOptions.map((column) => (
                                    <DropdownItem
                                        key={column.uid}
                                        className="capitalize"
                                    >
                                        {column.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {data?.length} pending payments
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
        orderFilter,
        onSearchChange,
        onRowsPerPageChange,
        onClear,
        data,
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
    }, [page, pages, onNextPage, onPreviousPage]);

    return (
        <Table
            isHeaderSticky
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px] scrollbar-none border shadow px-3",
            }}
            topContent={topContent}
            topContentPlacement="outside"
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
                items={filteredItems}
                isLoading={isPending}
                loadingContent={<Loader2 className="animate-spin" />}
            >
                {(item: PendingDetailsProps) => (
                    <TableRow key={item.orderId}>
                        {(columnKey) => (
                            // @ts-expect-error: cellValue is of type PendingDetailsProps
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
