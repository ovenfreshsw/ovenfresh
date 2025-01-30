"use client";

// import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { incomeType, categories } from "./data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { useId, useRef, useState } from "react";
import { DataTableViewOptions } from "./data-table-view-options";
import { CircleX, ListFilter, Trash, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const id = useId();
    const isFiltered = table.getState().columnFilters.length > 0;

    const inputRef = useRef<HTMLInputElement>(null);

    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
    });

    const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
        setDateRange({ from, to });
        // Filter table data based on selected date range
        table.getColumn("date")?.setFilterValue([from, to]);
    };

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <div className="relative">
                    <Input
                        id={`${id}-input`}
                        ref={inputRef}
                        className={cn(
                            "peer min-w-60 ps-9",
                            Boolean(
                                table.getColumn("label")?.getFilterValue()
                            ) && "pe-9"
                        )}
                        value={
                            (table
                                .getColumn("label")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) => {
                            table
                                .getColumn("label")
                                ?.setFilterValue(event.target.value);
                        }}
                        placeholder="Filter by label..."
                        type="text"
                        aria-label="Filter by label..."
                    />
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                        <ListFilter
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </div>
                    {Boolean(table.getColumn("label")?.getFilterValue()) && (
                        <button
                            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Clear filter"
                            onClick={() => {
                                table.getColumn("label")?.setFilterValue("");
                                if (inputRef.current) {
                                    inputRef.current.focus();
                                }
                            }}
                        >
                            <CircleX
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                        </button>
                    )}
                </div>
                {table.getColumn("category") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("category")}
                        title="Category"
                        options={categories}
                    />
                )}
                {table.getColumn("type") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("type")}
                        title="Type"
                        options={incomeType}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
                <CalendarDatePicker
                    date={dateRange}
                    onDateSelect={handleDateSelect}
                    className="h-9 w-[250px]"
                    variant="outline"
                />
            </div>

            <div className="flex items-center gap-2">
                {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                    <Button variant="outline" size="sm">
                        <Trash
                            className="-ms-1 me-1 opacity-60"
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                        Delete
                        <span className="-me-1 ms-2 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground">
                            {table.getFilteredSelectedRowModel().rows.length}
                        </span>
                    </Button>
                ) : null}
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}
