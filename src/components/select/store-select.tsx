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
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { setState } from "@/store/slices/selectStoreSlice";

const StoreSelect = ({
    stores,
}: {
    stores: { id: string; location: string }[];
}) => {
    const { update } = useSession();
    const queryClient = getQueryClient();
    const value = useSelector((state: RootState) => state.selectStore);
    const dispatch = useDispatch();

    const onValueChange = async (newStoreId: string) => {
        dispatch(setState(newStoreId));
        await update({ storeId: newStoreId });
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: ["order"],
            }),
            queryClient.invalidateQueries({
                queryKey: ["groceries"],
            }),
            queryClient.invalidateQueries({
                queryKey: ["stores"],
            }),
        ]);
    };

    return (
        <Select
            value={value} // Watch the selected value
            onValueChange={onValueChange} // Call the onValueChange function when the value changes
        >
            <SelectTrigger
                className="bg-primary-foreground !text-primary w-fit md:w-auto"
                data-placeholder="Store"
            >
                <>
                    <MapPin className="size-4" />
                    <SelectValue placeholder="Store" />
                </>
            </SelectTrigger>
            <SelectContent className="text-primary z-[1210] bg-primary-foreground lg:bg-white">
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
