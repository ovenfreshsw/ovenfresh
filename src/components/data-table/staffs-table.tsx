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
import { useStaffs } from "@/api-hooks/staffs/get-staffs";
import { UserDocumentPopulate } from "@/models/types/user";
import AddStaffDialog from "../dialog/add-staff-dialog";
import EditStaffDialog from "../dialog/edit-staff-dialog";
import { useStores } from "@/api-hooks/stores/get-stores";
import DeleteStaffDialog from "../dialog/delete-staff-dialog";

export const columns = [
    // { name: "ID", uid: "_id", sortable: true },
    { name: "USERNAME", uid: "username" },
    { name: "ROLE", uid: "role" },
    { name: "STORE", uid: "storeId", sortable: true },
    { name: "PASSWORD", uid: "password" },
    { name: "ACTIONS", uid: "actions" },
];

export default function StaffsTable() {
    const [filterValue, setFilterValue] = React.useState("");

    const { data: staffs, isPending } = useStaffs();
    const { data: stores } = useStores();

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredStaffs = staffs ? [...staffs] : [];

        if (hasSearchFilter) {
            filteredStaffs = filteredStaffs.filter((order) =>
                order.username.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredStaffs;
    }, [staffs, filterValue, hasSearchFilter]);

    const renderCell = React.useCallback(
        (staff: UserDocumentPopulate, columnKey: React.Key) => {
            const cellValue = staff[columnKey as keyof UserDocumentPopulate];

            switch (columnKey) {
                case "storeId":
                    // @ts-expect-error: cellValue is of type StoreDocument
                    return cellValue?.location;
                case "actions":
                    return (
                        <div className="flex gap-2.5 items-center justify-center">
                            <EditStaffDialog
                                stores={stores || []}
                                staff={staff}
                            />
                            <DeleteStaffDialog id={staff._id} />
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        [stores]
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
                        placeholder="Search by username"
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
                        <AddStaffDialog stores={stores || []} />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {staffs?.length} staffs
                    </span>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, staffs?.length, onClear, stores]);

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
                {(item: UserDocumentPopulate) => (
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
