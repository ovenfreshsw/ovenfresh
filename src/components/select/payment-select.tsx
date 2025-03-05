import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { FormControl } from "../ui/form";
import { useDispatch } from "react-redux";
import { setPaymentMethod } from "@/store/slices/cateringOrderSlice";
import { z } from "zod";
import { ZodCateringSchema, ZodTiffinSchema } from "@/lib/zod-schema/schema";
import { UseFormReturn } from "react-hook-form";

type CateringType = UseFormReturn<z.infer<typeof ZodCateringSchema>>;
type TiffinType = UseFormReturn<z.infer<typeof ZodTiffinSchema>>;

type PaymentSelectProps = {
    form: CateringType | TiffinType;
};

const PaymentSelect = ({ form }: PaymentSelectProps) => {
    const dispatch = useDispatch();
    return (
        <Select
            value={(form as CateringType).watch("payment_method")} // Watch the selected value
            onValueChange={(val: "card" | "cash") => {
                (form as CateringType).setValue("payment_method", val);
                dispatch(setPaymentMethod(val));
            }}
            defaultValue="cash"
        >
            <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder="payment" />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default PaymentSelect;
