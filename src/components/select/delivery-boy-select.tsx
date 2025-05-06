"use client";

import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { MapPin } from "lucide-react";
import { UserDocument } from "@/models/types/user";
import { toast } from "sonner";
import { changeDeliveryBoyAction } from "@/actions/change-delivery-boy-action";

const DeliveryBoySelect = ({
    staffs,
    defaultValue,
    zone,
}: {
    staffs: Pick<UserDocument, "_id" | "username" | "zone">[];
    zone: number;
    defaultValue?: string;
}) => {
    const [loading, setLoading] = useState(false);

    const onValueChange = async (staff: string) => {
        setLoading(true);
        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await changeDeliveryBoyAction(staff, zone);
                setLoading(false);
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Updating delivery boy...",
            success: () => "Updated successfully.",
            error: ({ error }) =>
                error ? error : "Failed to update delivery boy.",
        });
    };

    return (
        <Select
            // value={value} // Watch the selected value
            onValueChange={onValueChange} // Call the onValueChange function when the value changes
            defaultValue={defaultValue}
            disabled={loading}
        >
            <SelectTrigger className="w-fit md:w-auto text-xs capitalize">
                <>
                    <MapPin className="size-4" />
                    <SelectValue placeholder="Delivery Boy" />
                </>
            </SelectTrigger>
            <SelectContent className="text-primary z-[1210] bg-primary-foreground lg:bg-white">
                {staffs?.map((staff, i) => (
                    <SelectItem
                        value={staff._id.toString()}
                        key={i}
                        className="capitalize"
                    >
                        {staff.username}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default DeliveryBoySelect;
