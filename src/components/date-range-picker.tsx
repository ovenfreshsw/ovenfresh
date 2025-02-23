"use client";

import * as React from "react";
// import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@heroui/button";
import { Button as ShadButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Printer } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export function DatePickerWithRange({
    className,
    orderType,
}: React.HTMLAttributes<HTMLDivElement> & {
    orderType: "tiffin" | "catering";
}) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        size="sm"
                        radius="sm"
                        startContent={<Printer className="size-4" />}
                        variant="solid"
                        className="bg-white shadow hover:bg-gray-100"
                    >
                        Print Report
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                    <div className="py-3 px-4 pt-0 flex justify-end gap-3">
                        <ShadButton size="sm" variant={"ghost"}>
                            Cancel
                        </ShadButton>
                        <Link
                            href={`/summary/${orderType}?from=${format(
                                date?.from || new Date(),
                                "yyyy-MM-dd"
                            )}&to=${format(
                                date?.to || new Date(),
                                "yyyy-MM-dd"
                            )}`}
                            target="_blank"
                        >
                            <ShadButton size="sm">Print</ShadButton>
                        </Link>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
