import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { FormControl } from "../ui/form";

type OrderTypeSelectProps = {
    value: string;
    onValueChange: (value: "pickup" | "delivery") => void;
};

const OrderTypeSelect = ({ value, onValueChange }: OrderTypeSelectProps) => {
    return (
        <Select
            value={value} // Watch the selected value
            onValueChange={onValueChange} // Call the onValueChange function when the value changes
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
