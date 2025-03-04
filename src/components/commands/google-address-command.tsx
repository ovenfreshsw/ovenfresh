import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "../ui/command";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { MapPin } from "lucide-react";

type GoogleAddressCommandProps = {
    addresses: PlaceAutocompleteResult[];
    setSelectedAddress: (address: PlaceAutocompleteResult) => void;
};

const GoogleAddressCommand = ({
    addresses,
    setSelectedAddress,
}: GoogleAddressCommandProps) => {
    return (
        <Command className="absolute top-full left-0 w-full z-50 bg-white border rounded-md shadow-md mt-1 h-fit max-h-56">
            <CommandList>
                <CommandEmpty>No address found.</CommandEmpty>
                <CommandGroup>
                    {addresses &&
                        addresses.map((address, i) => (
                            <CommandItem
                                key={i}
                                className="justify-start items-center gap-2 py-2.5"
                                onSelect={() => setSelectedAddress(address)}
                            >
                                <MapPin className="size-4 text-primary/40" />
                                <span>{address.description}</span>
                            </CommandItem>
                        ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
};

export default GoogleAddressCommand;
