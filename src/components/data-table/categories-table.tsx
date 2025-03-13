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
import { CateringCategoryDocument } from "@/models/types/catering-category";
import { useCategories } from "@/api-hooks/get-catering-categories";
import AddCategoryDialog from "../dialog/add-category-dialog";
import EditCategoryDialog from "../dialog/edit-category-dialog";
import DeleteDialog from "../dialog/delete-dialog";
import { deleteCategoryAction } from "@/actions/delete-category-action";

export const columns = [
    { name: "ID", uid: "_id" },
    { name: "NAME", uid: "name" },
    { name: "ACTIONS", uid: "actions" },
];

export default function CateringCategoryTable() {
    const [filterValue, setFilterValue] = React.useState("");

    const { data: categories, isPending } = useCategories();

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredCategories = categories ? [...categories] : [];

        if (hasSearchFilter) {
            filteredCategories = filteredCategories.filter((category) =>
                category.name.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredCategories;
    }, [categories, filterValue, hasSearchFilter]);

    const renderCell = React.useCallback(
        (category: CateringCategoryDocument, columnKey: React.Key) => {
            const cellValue =
                category[columnKey as keyof CateringCategoryDocument];

            switch (columnKey) {
                case "actions":
                    return (
                        <div className="flex gap-2.5 items-center justify-center">
                            <EditCategoryDialog
                                id={category._id}
                                name={category.name}
                            />
                            <DeleteDialog
                                id={category._id}
                                action={deleteCategoryAction}
                                errorMsg="Failed to delete category."
                                loadingMsg="Deleting category..."
                                successMsg="Category deleted successfully."
                                title="category"
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
                    <div className="flex-1 flex justify-end gap-2">
                        <AddCategoryDialog />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {categories?.length} categories
                    </span>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, categories?.length, onClear]);

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
                {(item: CateringCategoryDocument) => (
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
