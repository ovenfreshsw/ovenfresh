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
import { ListFilter, Loader2 } from "lucide-react";
import { useStores } from "@/api-hooks/stores/get-stores";
import { StoreDocument } from "@/models/types/store";
import AddStoreDialog from "../dialog/add-store-dialog";
import DeleteStoreDialog from "../dialog/delete-store-dialog";
import EditStoreDialog from "../dialog/edit-store-dialog";

export const columns = [
    { name: "ID", uid: "_id" },
    { name: "NAME", uid: "name" },
    { name: "ADDRESS", uid: "address" },
    { name: "PHONE", uid: "phone" },
    { name: "LOCATION", uid: "location" },
    { name: "ACTIONS", uid: "actions" },
];

export default function StoresTable() {
    const [filterValue, setFilterValue] = React.useState("");

    const { data: stores, isPending } = useStores();

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredStores = stores ? [...stores] : [];

        if (hasSearchFilter) {
            filteredStores = filteredStores.filter((order) =>
                order.name.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredStores;
    }, [stores, filterValue, hasSearchFilter]);

    const renderCell = React.useCallback(
        (store: StoreDocument, columnKey: React.Key) => {
            const cellValue = store[columnKey as keyof StoreDocument];

            switch (columnKey) {
                case "actions":
                    return (
                        <div className="flex gap-2.5 items-center justify-center">
                            <EditStoreDialog store={store} />
                            <DeleteStoreDialog id={store._id} />
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
                        placeholder="Search by name or location"
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
                    <div className="flex-1 flex justify-end gap-2">
                        <AddStoreDialog />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {stores?.length} stores
                    </span>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, stores?.length, onClear]);

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
                {(item: StoreDocument) => (
                    <TableRow key={item._id}>
                        {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
