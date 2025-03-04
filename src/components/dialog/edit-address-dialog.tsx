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
import { useState } from "react";
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

function isGapInWeeks(
    startDate: Date,
    endDate: Date,
    numberOfWeeks: number
): boolean {
    // Convert the number of weeks to milliseconds
    const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;
    const expectedGapInMilliseconds =
        Number(numberOfWeeks) * millisecondsInWeek;

    // Calculate the actual gap in milliseconds
    const actualGapInMilliseconds =
        new Date(endDate).getTime() - new Date(startDate).getTime();

    // Check if the actual gap is equal to the expected gap
    return actualGapInMilliseconds === expectedGapInMilliseconds;
}

const EditAddressDialog = ({
    orderId,
    orderType,
    address,
    deliveryDate,
    startDate,
    endDate,
    numberOfWeeks,
}: {
    orderId: string;
    orderType: "catering" | "tiffin";
    address: AddressDocument;
    numberOfWeeks?: number;
    deliveryDate?: Date;
    startDate?: Date;
    endDate?: Date;
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [addressInput, setAddressInput] = useState({
        address: address.address,
        key: 0,
    });
    const [placeId, setPlaceId] = useState<string>(address.placeId);
    const [dDate, setDDate] = useState<Date | undefined>(deliveryDate);
    const [sDate, setSDate] = useState<Date | undefined>(startDate);
    const [eDate, setEDate] = useState<Date | undefined>(
        new Date(endDate || "")
    );

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
                    <div className="flex items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                            Address
                        </Label>
                        <AddressAutocomplete
                            addresses={addressPredictions || []}
                            setSelectedAddress={setSelectedAddress}
                            className="w-full"
                        >
                            <Input
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
                    {orderType === "catering" ? (
                        <div className="flex items-center gap-4">
                            <Label htmlFor="deliveryDate">Delivery Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <ShadButton
                                        variant={"outline"}
                                        className={cn(
                                            "pl-3 text-left font-normal w-full",
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
                                        onSelect={(e) => setDDate(e as Date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-4">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <ShadButton
                                            variant={"outline"}
                                            className={cn(
                                                "pl-3 text-left font-normal w-full",
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
                                            selected={sDate}
                                            disabled={{ before: new Date() }}
                                            onSelect={(e) =>
                                                setSDate(e as Date)
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex items-center gap-4">
                                <Label htmlFor="endDate">End Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <ShadButton
                                            variant={"outline"}
                                            className={cn(
                                                "pl-3 text-left font-normal w-full",
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
                                                    eDate?.getFullYear() ||
                                                        new Date().getFullYear(),
                                                    eDate?.getMonth() ||
                                                        new Date().getMonth(),
                                                    eDate?.getDate() ||
                                                        new Date().getDate()
                                                )
                                            }
                                            defaultMonth={
                                                new Date(
                                                    eDate?.getFullYear() ||
                                                        new Date().getFullYear(),
                                                    eDate?.getMonth() ||
                                                        new Date().getMonth(),
                                                    eDate?.getDate() ||
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
                                            // selected={
                                            //     new Date(
                                            //         "2025-03-12T00:00:00.000Z"
                                            //     )
                                            // }
                                            // disabled={{ before: new Date() }}
                                            // onSelect={(e) =>
                                            //     setEDate(e as Date)
                                            // }
                                            // initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            {!isGapInWeeks(
                                sDate!,
                                eDate!,
                                numberOfWeeks || 0
                            ) && (
                                <Alert severity="error">
                                    The dates do not match the {numberOfWeeks}{" "}
                                    weeks gap.
                                </Alert>
                            )}
                        </>
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
                                    sDate!,
                                    eDate!,
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
