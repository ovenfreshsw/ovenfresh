"use client";

import { useEffect, useRef, useState } from "react";
import GoogleAddressCommand from "./commands/google-address-command";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";

type AddressAutocompleteProps = {
    children: React.ReactNode;
    addresses: PlaceAutocompleteResult[];
    setSelectedAddress: (address: PlaceAutocompleteResult) => void;
    className?: string;
};

const AddressAutocomplete = ({
    children,
    addresses,
    setSelectedAddress,
    className,
}: AddressAutocompleteProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useClickOutside(ref, () => setOpen(false));

    useEffect(() => {
        setOpen((addresses?.length ?? 0) > 0);
    }, [addresses]);

    return (
        <div className={cn("relative", className)} ref={ref}>
            {children}
            {open && (
                <GoogleAddressCommand
                    addresses={addresses}
                    setSelectedAddress={(address) => {
                        setSelectedAddress(address);
                        setOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default AddressAutocomplete;
