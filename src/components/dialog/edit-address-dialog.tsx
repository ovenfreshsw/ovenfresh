"use client";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button as ShadButton } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Button } from "@heroui/button";
import { CalendarIcon, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { editAddressAction } from "@/actions/edit-address-action";
import { AddressDocument } from "@/models/types/address";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Alert } from "@mui/material";
import AddressAutocomplete from "../address-autocomplete";
import { useSearchAddress } from "@/api-hooks/use-search-address";
import { useDebounce } from "@/hooks/use-debounce";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { Textarea } from "../ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

function isGapInWeeks(
    startDate: Date,
    endDate: Date,
    numberOfWeeks: number
): boolean {
    // Calculate the difference in milliseconds
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const actualGapInMilliseconds =
        new Date(format(endDate, "yyyy-MM-dd")).getTime() -
        new Date(format(startDate, "yyyy-MM-dd")).getTime();

    // Calculate the actual number of days between the two dates
    const actualGapInDays = actualGapInMilliseconds / millisecondsInDay;

    // Check if the gap in days is exactly the expected number of weeks (numberOfWeeks * 7 days)
    return actualGapInDays === numberOfWeeks * 7 - 3;
}

const EditAddressDialog = ({
    orderId,
    orderType,
    address,
    deliveryDate,
    startDate,
    endDate,
    numberOfWeeks,
    type,
}: {
    orderId: string;
    orderType: "catering" | "tiffin";
    address: AddressDocument;
    numberOfWeeks?: number;
    deliveryDate?: Date;
    startDate?: Date;
    endDate?: Date;
    type?: "pickup" | "delivery";
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [addressInput, setAddressInput] = useState({
        address: address.address,
        key: 0,
    });
    const [placeId, setPlaceId] = useState<string>(address.placeId);
    const [order_type, setOrder_Type] = useState(type);
    const [dDate, setDDate] = useState<Date | undefined>(deliveryDate);
    const [sDate, setSDate] = useState<Date | undefined>(startDate);
    const [eDate, setEDate] = useState<Date | undefined>(
        new Date(endDate || "")
    );

    useEffect(() => {
        setEDate(endDate);
    }, [endDate]);

    const debouncedAddress = useDebounce(addressInput.address, 500);

    const { data: addressPredictions } = useSearchAddress({
        address: debouncedAddress,
        key: addressInput.key,
    });

    const handleSubmit = async (formData: FormData) => {
        formData.append("orderId", orderId);
        formData.append("orderType", orderType);
        formData.append("addressId", address._id.toString());
        formData.append("customerId", address.customerId.toString());
        formData.append("lat", address.lat.toString());
        formData.append("lng", address.lng.toString());

        if (dDate) formData.append("deliveryDate", dDate.toString());
        if (sDate) formData.append("startDate", sDate.toString());
        if (eDate) formData.append("endDate", eDate.toString());
        if (order_type) formData.append("order_type", order_type);

        setLoading(true);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await editAddressAction(formData);
                setLoading(false);
                setOpen(false);
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Updating delivery address...",
            success: () => "Delivery address updated successfully.",
            error: () => "Failed to update delivery address.",
        });
    };

    function resetDate() {
        setDDate(deliveryDate);
        setSDate(startDate);
        setEDate(endDate);
        setOpen(false);
    }

    function setSelectedAddress(selectedAddress: PlaceAutocompleteResult) {
        setAddressInput({ address: selectedAddress.description, key: 0 });
        setPlaceId(selectedAddress.place_id);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button isIconOnly variant="flat" radius="full" size="sm">
                    <Pencil size={15} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit delivery address</DialogTitle>
                </DialogHeader>
                <form
                    id="edit-address-form"
                    action={handleSubmit}
                    className="grid gap-4 py-4"
                >
                    <div className="grid grid-cols-4 gap-2">
                        <Label htmlFor="address">Address</Label>
                        <AddressAutocomplete
                            addresses={addressPredictions || []}
                            setSelectedAddress={setSelectedAddress}
                            className="col-span-3"
                        >
                            <Textarea
                                id="address"
                                name="address"
                                value={addressInput.address}
                                onChange={(e) =>
                                    setAddressInput({
                                        address: e.target.value,
                                        key: 1,
                                    })
                                }
                            />
                        </AddressAutocomplete>
                    </div>
                    <input name="placeId" hidden readOnly value={placeId} />
                    <div className="grid grid-cols-4 gap-2">
                        <Label htmlFor="aptSuiteUnit">Apt, suite or unit</Label>
                        <Input
                            placeholder="Apt, suite or unit"
                            id="aptSuiteUnit"
                            name="aptSuiteUnit"
                            defaultValue={address.aptSuiteUnit}
                            className="col-span-3"
                        />
                    </div>
                    {orderType === "catering" ? (
                        <div className="grid grid-cols-4 gap-2">
                            <Label htmlFor="deliveryDate">Delivery Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <ShadButton
                                        variant={"outline"}
                                        className={cn(
                                            "pl-3 text-left font-normal w-full col-span-3",
                                            !dDate && "text-muted-foreground"
                                        )}
                                        type="button"
                                    >
                                        {dDate ? (
                                            format(dDate, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </ShadButton>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0 z-[1560]"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        id="deliveryDate"
                                        selected={dDate}
                                        disabled={{ before: new Date() }}
                                        required
                                        onSelect={(e) => setDDate(e as Date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-4 gap-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <ShadButton
                                            variant={"outline"}
                                            className={cn(
                                                "pl-3 text-left font-normal w-full col-span-3",
                                                !sDate &&
                                                    "text-muted-foreground"
                                            )}
                                            type="button"
                                        >
                                            {sDate ? (
                                                format(sDate, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </ShadButton>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0 z-[1560]"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            id="startDate"
                                            selected={
                                                new Date(
                                                    new Date(
                                                        sDate || ""
                                                    )?.getFullYear() ||
                                                        new Date().getFullYear(),
                                                    new Date(
                                                        sDate || ""
                                                    )?.getMonth() ||
                                                        new Date().getMonth(),
                                                    new Date(
                                                        sDate || ""
                                                    )?.getDate() ||
                                                        new Date().getDate()
                                                )
                                            }
                                            defaultMonth={
                                                new Date(
                                                    new Date(
                                                        sDate || ""
                                                    )?.getFullYear() ||
                                                        new Date().getFullYear(),
                                                    new Date(
                                                        sDate || ""
                                                    )?.getMonth() ||
                                                        new Date().getMonth(),
                                                    new Date(
                                                        sDate || ""
                                                    )?.getDate() ||
                                                        new Date().getDate()
                                                )
                                            }
                                            disabled={{ dayOfWeek: [0, 6] }}
                                            onSelect={(e) =>
                                                setSDate(e as Date)
                                            }
                                            required
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <ShadButton
                                            variant={"outline"}
                                            className={cn(
                                                "pl-3 text-left font-normal w-full col-span-3",
                                                !eDate &&
                                                    "text-muted-foreground"
                                            )}
                                            type="button"
                                        >
                                            {eDate ? (
                                                format(eDate, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </ShadButton>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0 z-[1560]"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            id="endDate"
                                            selected={
                                                new Date(
                                                    new Date(
                                                        eDate || ""
                                                    )?.getFullYear() ||
                                                        new Date().getFullYear(),
                                                    new Date(
                                                        eDate || ""
                                                    )?.getMonth() ||
                                                        new Date().getMonth(),
                                                    new Date(
                                                        eDate || ""
                                                    )?.getDate() ||
                                                        new Date().getDate()
                                                )
                                            }
                                            defaultMonth={
                                                new Date(
                                                    new Date(
                                                        eDate || ""
                                                    )?.getFullYear() ||
                                                        new Date().getFullYear(),
                                                    new Date(
                                                        eDate || ""
                                                    )?.getMonth() ||
                                                        new Date().getMonth(),
                                                    new Date(
                                                        eDate || ""
                                                    )?.getDate() ||
                                                        new Date().getDate()
                                                )
                                            }
                                            initialFocus
                                            onSelect={(e) => setEDate(e)}
                                            footer={
                                                <p>
                                                    You picker{" "}
                                                    {format(
                                                        eDate as Date,
                                                        "PP"
                                                    )}
                                                </p>
                                            }
                                            required
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            {!isGapInWeeks(
                                new Date(sDate || ""),
                                new Date(eDate || ""),
                                numberOfWeeks || 0
                            ) && (
                                <Alert severity="error">
                                    The dates do not match the {numberOfWeeks}{" "}
                                    weeks gap.
                                </Alert>
                            )}
                        </>
                    )}
                    {orderType === "catering" && type && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="order_type" className="text-right">
                                Order Type
                            </Label>
                            <Select
                                value={order_type}
                                onValueChange={(value) =>
                                    setOrder_Type(
                                        value as "pickup" | "delivery"
                                    )
                                }
                            >
                                <SelectTrigger
                                    id="order_type"
                                    className="col-span-3"
                                >
                                    <SelectValue placeholder="order type" />
                                </SelectTrigger>
                                <SelectContent className="z-[1560]">
                                    <SelectItem value="pickup">
                                        Pickup
                                    </SelectItem>
                                    <SelectItem value="delivery">
                                        Delivery
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </form>
                <DialogFooter>
                    <ShadButton
                        disabled={loading}
                        type="button"
                        variant={"ghost"}
                        onClick={resetDate}
                    >
                        Cancel
                    </ShadButton>
                    <ShadButton
                        disabled={
                            loading ||
                            (orderType === "tiffin" &&
                                !isGapInWeeks(
                                    new Date(sDate || ""),
                                    new Date(eDate || ""),
                                    numberOfWeeks || 0
                                ))
                        }
                        form="edit-address-form"
                        type="submit"
                    >
                        Save changes
                    </ShadButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditAddressDialog;
