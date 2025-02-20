import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { FormControl } from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { ZodTiffinSchema } from "@/lib/zod-schema/schema";

type OrderTypeSelectProps = {
    form: UseFormReturn<z.infer<typeof ZodTiffinSchema>>;
};

const OrderTypeSelect = ({ form }: OrderTypeSelectProps) => {
    return (
        <Select
            value={form.watch("order_type")} // Watch the selected value
            onValueChange={(val: "pickup" | "delivery") => {
                form.setValue("order_type", val);
            }}
            defaultValue="pickup"
        >
            <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder="order type" />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default OrderTypeSelect;
