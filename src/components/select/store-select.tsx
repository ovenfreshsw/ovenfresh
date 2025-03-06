"use client";

import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import getQueryClient from "@/lib/query-utils/get-query-client";

const StoreSelect = ({
    active,
    stores,
}: {
    active: string;
    stores: { id: string; location: string }[];
}) => {
    const { update } = useSession();
    const queryClient = getQueryClient();

    const onValueChange = async (newStoreId: string) => {
        await update({ storeId: newStoreId });
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: ["order"],
            }),
            queryClient.invalidateQueries({
                queryKey: ["menu", "tiffin"],
            }),
        ]);
    };
    return (
        <Select
            // value={value} // Watch the selected value
            onValueChange={onValueChange} // Call the onValueChange function when the value changes
            defaultValue={active}
        >
            <SelectTrigger className="bg-primary-foreground text-primary w-fit md:w-auto">
                <>
                    <MapPin className="size-4" />
                    <SelectValue placeholder="Store" />
                </>
            </SelectTrigger>
            <SelectContent className="text-primary">
                {stores.map((store, i) => (
                    <SelectItem value={store.id} key={i}>
                        {store.location}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default StoreSelect;
