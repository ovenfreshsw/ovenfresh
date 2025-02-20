import { CustomerSearchResult } from "@/lib/types/customer";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "../ui/command";

type AddressCommandProps = {
    customers?: CustomerSearchResult[] | null;
    setShowAutocomplete: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedCustomer: (customer: CustomerSearchResult) => void;
};

const AddressCommand = ({
    customers,
    setShowAutocomplete,
    setSelectedCustomer,
}: AddressCommandProps) => {
    return (
        <Command className="absolute top-full left-0 w-full z-50 bg-white border rounded-md shadow-md mt-1 h-fit max-h-40">
            <CommandList>
                <CommandEmpty>No address found.</CommandEmpty>
                <CommandGroup>
                    {customers &&
                        customers.map((customer, i) => (
                            <CommandItem
                                key={i}
                                className="flex-col justify-start items-start gap-1"
                                onSelect={() => {
                                    setSelectedCustomer(customer);
                                    setShowAutocomplete(false);
                                }}
                            >
                                <span>
                                    {customer.firstName} {customer.lastName}
                                </span>
                                <p className="text-xs text-muted-foreground">
                                    {customer.address.address}
                                </p>
                            </CommandItem>
                        ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
};

export default AddressCommand;
