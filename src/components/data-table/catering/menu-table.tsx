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
import { ListFilter, Loader2, Pencil, Plus } from "lucide-react";
import { useCateringMenu } from "@/api-hooks/catering/get-catering-menu";
import { CateringMenuDocumentPopulate } from "@/models/types/catering-menu";
import Image from "next/image";
import { Chip } from "@heroui/chip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteDialog from "@/components/dialog/delete-dialog";
import { deleteCateringMenuAction } from "@/actions/delete-catering-menu-action";

export const columns = [
    { name: "IMAGE", uid: "image" },
    { name: "NAME", uid: "name" },
    { name: "CATEGORY", uid: "category" },
    { name: "SMALL", uid: "smallPrice" },
    { name: "MEDIUM", uid: "mediumPrice" },
    { name: "LARGE", uid: "largePrice" },
    { name: "DISABLED", uid: "disabled" },
    { name: "ACTIONS", uid: "actions" },
];

export default function CateringMenuTable() {
    const [filterValue, setFilterValue] = React.useState("");

    const { data: menus, isPending } = useCateringMenu();

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredMenus = menus ? [...menus] : [];

        if (hasSearchFilter) {
            filteredMenus = filteredMenus.filter((grocery) =>
                grocery.name.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredMenus;
    }, [menus, filterValue, hasSearchFilter]);

    const renderCell = React.useCallback(
        (menu: CateringMenuDocumentPopulate, columnKey: React.Key) => {
            const cellValue =
                menu[columnKey as keyof CateringMenuDocumentPopulate];

            switch (columnKey) {
                case "category":
                    // @ts-expect-error: cellValue is of type CateringMenuDocumentPopulate
                    return cellValue?.name;
                case "name":
                    return `${cellValue} (${menu.variant})`;
                case "smallPrice":
                    return cellValue
                        ? `$${cellValue} (${menu.smallServingSize})`
                        : "--";
                case "mediumPrice":
                    return cellValue
                        ? `$${cellValue} (${menu.mediumServingSize})`
                        : "--";
                case "largePrice":
                    return cellValue
                        ? `$${cellValue} (${menu.largeServingSize})`
                        : "--";
                case "image":
                    return (
                        <Image
                            src={
                                (cellValue as string) || "/fsr-placeholder.webp"
                            }
                            alt="menu"
                            width={40}
                            height={40}
                            className="rounded-md"
                        />
                    );
                case "disabled":
                    return (
                        <Chip
                            size="sm"
                            color={cellValue ? "primary" : "secondary"}
                        >
                            {cellValue ? "Yes" : "No"}
                        </Chip>
                    );
                case "actions":
                    return (
                        <div className="flex gap-2.5 items-center justify-center">
                            <Button variant="ghost" size="sm" asChild>
                                <Link
                                    href={`/dashboard/menus/edit?id=${menu._id}`}
                                >
                                    <Pencil size={15} />
                                </Link>
                            </Button>
                            <DeleteDialog
                                id={menu._id}
                                action={deleteCateringMenuAction}
                                loadingMsg="Deleting item..."
                                errorMsg="Failed to delete item."
                                successMsg="Menu item deleted successfully."
                                title="menu item"
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
                        placeholder="Search by menu items"
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
                        <Button
                            size={"sm"}
                            className="flex items-center gap-2"
                            asChild
                        >
                            <Link href={"/dashboard/menus/add"}>
                                <Plus />
                                Add catering menu
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {menus?.length} menu items
                    </span>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, menus?.length, onClear]);

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
                {(item: CateringMenuDocumentPopulate) => (
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
