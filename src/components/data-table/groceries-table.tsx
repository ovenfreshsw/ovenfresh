"use client";

import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { ListFilter, Loader2, X } from "lucide-react";
import { GroceryDocument } from "@/models/types/grocery";
import { useGroceries } from "@/api-hooks/grocery/get-groceries";
import AddGroceryDialog from "../dialog/add-grocery-dialog";
import { format } from "date-fns";
import EditGroceryDialog from "../dialog/edit-grocery-dialog";
import DateFilter from "../scheduled-orders/date-filter";
import { Button } from "../ui/button";
import DeleteDialog from "../dialog/delete-dialog";
import { deleteGroceryAction } from "@/actions/delete-grocery-action";

export const columns = [
    { name: "DATE", uid: "date" },
    { name: "ITEM", uid: "item" },
    { name: "QUANTITY", uid: "quantity" },
    { name: "PRICE", uid: "price" },
    { name: "TAX", uid: "tax" },
    { name: "TOTAL", uid: "total" },
    { name: "ACTIONS", uid: "actions" },
];

export default function GroceriesTable() {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedDate, setSelectedDate] = React.useState<Date | "all">("all");

    const { data: groceries, isPending } = useGroceries(selectedDate);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredGroceries = groceries ? [...groceries] : [];

        if (hasSearchFilter) {
            filteredGroceries = filteredGroceries.filter((grocery) =>
                grocery.item.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredGroceries;
    }, [groceries, filterValue, hasSearchFilter]);

    const renderCell = React.useCallback(
        (grocery: GroceryDocument, columnKey: React.Key) => {
            const cellValue = grocery[columnKey as keyof GroceryDocument];

            switch (columnKey) {
                case "date":
                    return format(cellValue as Date, "PPP");
                case "quantity":
                    return `${cellValue ?? ""} ${
                        grocery.unit === "none" ? "" : grocery.unit
                    }`;
                case "price":
                    return `$${cellValue}`;
                case "tax":
                    return `$${cellValue}`;
                case "total":
                    return `$${cellValue}`;
                case "actions":
                    return (
                        <div className="flex gap-2.5 items-center justify-center">
                            <EditGroceryDialog grocery={grocery} />
                            <DeleteDialog
                                id={grocery._id}
                                action={deleteGroceryAction}
                                errorMsg="Failed to delete item."
                                loadingMsg="Deleting category..."
                                successMsg="Grocery item deleted successfully."
                                title="grocery item"
                            />
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        []
    );

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
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
                        placeholder="Search by items"
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
                    {/* Date Filter */}
                    <DateFilter
                        date={
                            selectedDate === "all" ? new Date() : selectedDate
                        }
                        onSelect={setSelectedDate}
                        footer="Groceries bought on"
                    />
                    {selectedDate !== "all" && (
                        <Button
                            size={"icon"}
                            className="rounded-full"
                            variant={"outline"}
                            onClick={() => setSelectedDate("all")}
                        >
                            <X size={15} />
                        </Button>
                    )}
                    <div className="flex-1 flex justify-end gap-2">
                        <AddGroceryDialog />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {groceries?.length} grocery items
                    </span>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, groceries?.length, onClear, selectedDate]);

    return (
        <Table
            isHeaderSticky
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px] scrollbar-none border shadow-md px-3",
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
                {(item: GroceryDocument) => (
                    <TableRow key={item._id}>
                        {(columnKey) => (
                            // @ts-expect-error: columnKey is of type keyof GroceryDocument
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
