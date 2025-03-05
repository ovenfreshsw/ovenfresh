import React, { useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { FormControl } from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import { ZodTiffinSchema } from "@/lib/zod-schema/schema";
import { z } from "zod";
import { calculateEndDate } from "@/lib/utils";

const TiffinWeeksSelect = ({
    form,
    setEndDateText,
}: {
    form: UseFormReturn<z.infer<typeof ZodTiffinSchema>>;
    setEndDateText: React.Dispatch<React.SetStateAction<string>>;
}) => {
    // Watch the form state to reset the Select component
    useEffect(() => {
        if (!form.formState.isDirty) {
            form.setValue("number_of_weeks", "2");
        }
    }, [form, form.formState.isDirty, form.setValue]);

    return (
        <Select
            value={form.watch("number_of_weeks")} // Watch the selected value
            onValueChange={(val) => {
                form.setValue("number_of_weeks", val);
                calculateEndDate(
                    form.getValues("number_of_weeks"),
                    form,
                    setEndDateText
                );
            }}
        >
            <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder="No. Of weeks" />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                <SelectItem value="2">2 weeks</SelectItem>
                <SelectItem value="3">3 weeks</SelectItem>
                <SelectItem value="4">4 weeks</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default TiffinWeeksSelect;
