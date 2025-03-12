"use client";

import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { format } from "date-fns";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ZodCateringSchema } from "@/lib/zod-schema/schema";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useSearchCustomer } from "@/api-hooks/use-search-customer";
import { CustomerSearchResult } from "@/lib/types/customer";
import { useDebounce } from "@/hooks/use-debounce";
import PaymentSelect from "../select/payment-select";
import AddressCommand from "../commands/address-command";
import { useDispatch } from "react-redux";
import { clearState } from "@/store/slices/cateringItemSlice";
import {
    setCustomerDetails,
    setDeliveryCharge,
    setDeliveryDate,
    setOrderType,
} from "@/store/slices/cateringOrderSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import OrderTypeSelect from "../select/order-type-select";
import AddressAutocomplete from "../address-autocomplete";
import { useSearchAddress } from "@/api-hooks/use-search-address";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { Textarea } from "../ui/textarea";

export default function CateringForm({
    form,
}: {
    form: UseFormReturn<z.infer<typeof ZodCateringSchema>>;
}) {
    const clickOutsideRef = useRef(null);
    const [phone, setPhone] = useState("");
    const [showAutocomplete, setShowAutocomplete] = useState(false);

    const dispatch = useDispatch();
    const orderDetail = useSelector((state: RootState) => state.cateringOrder);

    const debouncedPhone = useDebounce(phone, 300);
    const debouncedAddress = useDebounce(
        orderDetail.customerDetails.address.address,
        500
    );

    // React queries
    const { data: customers } = useSearchCustomer(debouncedPhone);
    const { data: addressPredictions } = useSearchAddress({
        address: debouncedAddress,
        key: orderDetail.customerDetails.address.key,
    });

    // Automatically toggle showAutocomplete when customers update
    useEffect(() => {
        setShowAutocomplete((customers?.length ?? 0) > 0);
    }, [customers]);

    useClickOutside(clickOutsideRef, () => setShowAutocomplete(false));

    function setSelectedAddress(address: PlaceAutocompleteResult) {
        dispatch(
            setCustomerDetails({
                address: { address: address.description, key: 0 },
                placeId: address.place_id,
            })
        );
        form.setValue("customerDetails.address", address.description || "");
        form.setValue("customerDetails.lat", 0);
        form.setValue("customerDetails.lng", 0);
    }

    function setSelectedCustomer(customer: CustomerSearchResult) {
        dispatch(
            setCustomerDetails({
                phone: customer.phone || "",
                firstName: customer.firstName || "",
                lastName: customer.lastName || "",
                address: { address: customer.address.address || "", key: 0 },
                placeId: customer.address.placeId,
            })
        );

        form.setValue("customerDetails.phone", customer.phone || "");
        form.setValue("customerDetails.firstName", customer.firstName || "");
        form.setValue("customerDetails.lastName", customer.lastName || "");
        form.setValue(
            "customerDetails.address",
            customer.address.address || ""
        );
        form.setValue("customerDetails.lat", customer.address.lat);
        form.setValue("customerDetails.lng", customer.address.lng);
    }

    function resetForm() {
        form.reset();
        dispatch(clearState());
        setPhone("");
    }

    return (
        <div className="rounded-md border shadow w-full md:w-fit p-5 md:p-10 mx-auto">
            <Form {...form}>
                <div className="flex justify-between items-center">
                    <Typography variant="h6">Enter Address</Typography>
                    <Button
                        onClick={resetForm}
                        type="button"
                        size="sm"
                        variant={"ghost"}
                    >
                        Reset
                    </Button>
                </div>
                <form className="space-y-4 max-w-3xl mx-auto py-7 lg:py-10">
                    <div>
                        <FormField
                            control={form.control}
                            name="customerDetails.phone"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start justify-between h-full">
                                    <FormLabel>Phone number</FormLabel>
                                    <FormControl className="w-full">
                                        <div
                                            className="relative"
                                            ref={clickOutsideRef}
                                        >
                                            <PhoneInput
                                                placeholder="phone"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setPhone(e);
                                                    dispatch(
                                                        setCustomerDetails({
                                                            phone: e,
                                                        })
                                                    );
                                                }}
                                                defaultCountry="CA"
                                            />
                                            {showAutocomplete && (
                                                <AddressCommand
                                                    customers={customers}
                                                    setShowAutocomplete={
                                                        setShowAutocomplete
                                                    }
                                                    setSelectedCustomer={
                                                        setSelectedCustomer
                                                    }
                                                />
                                            )}
                                        </div>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <FormField
                                control={form.control}
                                name="customerDetails.firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="first name"
                                                type="text"
                                                {...field}
                                                value={
                                                    orderDetail.customerDetails
                                                        .firstName
                                                }
                                                onChange={(e) => {
                                                    dispatch(
                                                        setCustomerDetails({
                                                            firstName:
                                                                e.target.value,
                                                        })
                                                    );
                                                    form.setValue(
                                                        "customerDetails.firstName",
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="customerDetails.lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="last name"
                                                type="text"
                                                {...field}
                                                value={
                                                    orderDetail.customerDetails
                                                        .lastName
                                                }
                                                onChange={(e) => {
                                                    dispatch(
                                                        setCustomerDetails({
                                                            lastName:
                                                                e.target.value,
                                                        })
                                                    );
                                                    form.setValue(
                                                        "customerDetails.lastName",
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="customerDetails.address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <AddressAutocomplete
                                        addresses={addressPredictions ?? []}
                                        setSelectedAddress={setSelectedAddress}
                                    >
                                        <Textarea
                                            placeholder="address"
                                            {...field}
                                            value={
                                                orderDetail.customerDetails
                                                    .address.address
                                            }
                                            onChange={(e) => {
                                                dispatch(
                                                    setCustomerDetails({
                                                        address: {
                                                            address:
                                                                e.target.value,
                                                            key: 1,
                                                        },
                                                    })
                                                );
                                                form.setValue(
                                                    "customerDetails.address",
                                                    e.target.value
                                                );
                                            }}
                                        />
                                    </AddressAutocomplete>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="customerDetails.aptSuiteUnit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apt, suite or unit</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Apt, suite or unit"
                                        type="text"
                                        {...field}
                                        value={
                                            orderDetail.customerDetails
                                                .aptSuiteUnit
                                        }
                                        onChange={(e) => {
                                            dispatch(
                                                setCustomerDetails({
                                                    aptSuiteUnit:
                                                        e.target.value,
                                                })
                                            );
                                            form.setValue(
                                                "customerDetails.aptSuiteUnit",
                                                e.target.value
                                            );
                                        }}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="deliveryDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col h-full justify-between">
                                <FormLabel>Delivery date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "pl-3 text-left font-normal",
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            disabled={{ before: new Date() }}
                                            onSelect={(e) => {
                                                field.onChange(e);
                                                dispatch(
                                                    setDeliveryDate(
                                                        format(
                                                            e as Date,
                                                            "yyyy-MM-dd"
                                                        )
                                                    )
                                                );
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="payment_method"
                        render={() => (
                            <FormItem>
                                <FormLabel>Payment Method</FormLabel>
                                <PaymentSelect form={form} />
                                <FormDescription>
                                    Select a payment method
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="order_type"
                        render={() => (
                            <FormItem>
                                <FormLabel>Order Type</FormLabel>
                                <OrderTypeSelect
                                    value={form.watch("order_type")}
                                    onValueChange={(
                                        val: "pickup" | "delivery"
                                    ) => {
                                        if (val === "delivery") {
                                            dispatch(
                                                setDeliveryCharge(
                                                    Number(
                                                        process.env
                                                            .NEXT_PUBLIC_DELIVERY_CHARGE
                                                    ) || 0
                                                )
                                            );
                                        } else {
                                            dispatch(setDeliveryCharge(0));
                                        }
                                        dispatch(setOrderType(val));
                                        form.setValue("order_type", val);
                                    }}
                                />
                                <FormDescription>
                                    Select a order type
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    );
}
