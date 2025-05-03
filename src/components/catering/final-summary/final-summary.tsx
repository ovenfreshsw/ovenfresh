import { CalendarIcon, CreditCard, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { ZodCateringSchema } from "@/lib/zod-schema/schema";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatDate } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import FinalItemCard from "./final-item-card";
import {
    setAdvancePaid,
    setDeliveryCharge,
    setDiscount,
    setFullyPaid,
    setNote,
    setPendingBalance,
    setTaxAmount,
    setTotalPrice,
} from "@/store/slices/cateringOrderSlice";
import { useDispatch } from "react-redux";
import { Checkbox } from "@heroui/checkbox";
import FinalCustomItemCard from "./final-custom-item-card";

export default function FinalSummary({
    form,
}: {
    form: UseFormReturn<z.infer<typeof ZodCateringSchema>>;
}) {
    const [noTax, setNoTax] = useState(false);
    const orderItems = useSelector((state: RootState) => state.cateringItem);
    const customItems = useSelector(
        (state: RootState) => state.cateringCustomItem
    );
    const orderDetail = useSelector((state: RootState) => state.cateringOrder);
    const deliveryCharge = orderDetail.deliveryCharge;

    const dispatch = useDispatch();

    const handleAdvanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || Number.parseFloat(value) > 0) {
            dispatch(setAdvancePaid(Number(value)));
        }
    };

    const handleDeliveryChargeChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        if (value === "" || Number.parseFloat(value) > 0) {
            dispatch(setDeliveryCharge(Number(value)));
        }
    };

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || Number.parseFloat(value) > 0) {
            dispatch(setDiscount(Number(value)));
        }
    };

    const address = {
        ...form.getValues("customerDetails"),
        deliveryDate: form.getValues("deliveryDate"),
        paymentMethod: form.getValues("payment_method"),
    };

    const subtotal =
        orderItems.reduce(
            (acc, item) => acc + item.priceAtOrder * item.quantity,
            0
        ) + customItems.reduce((acc, item) => acc + item.priceAtOrder, 0);
    useEffect(() => {
        if (noTax) {
            dispatch(setTaxAmount(0));
            dispatch(setTotalPrice(subtotal + deliveryCharge));
            return;
        }
        const tax =
            (subtotal * (Number(process.env.NEXT_PUBLIC_TAX_AMOUNT) || 0)) /
            100;
        const total = subtotal + tax + deliveryCharge;
        dispatch(setTotalPrice(total));
        dispatch(setTaxAmount(tax));
    }, [subtotal, noTax, dispatch, deliveryCharge]);

    useEffect(() => {
        dispatch(
            setPendingBalance(
                orderDetail.totalPrice -
                    orderDetail.advancePaid -
                    orderDetail.discount
            )
        );
        dispatch(
            setFullyPaid(
                orderDetail.totalPrice -
                    orderDetail.advancePaid -
                    orderDetail.discount <=
                    0
            )
        );
    }, [
        orderDetail.totalPrice,
        orderDetail.advancePaid,
        orderDetail.discount,
        dispatch,
    ]);

    useEffect(() => {
        form.setValue("totalPrice", orderDetail.totalPrice);
    }, [form, orderDetail.totalPrice]);

    useEffect(() => {
        dispatch(
            setPendingBalance(
                Number(form.getValues("totalPrice")) -
                    orderDetail.advancePaid -
                    orderDetail.discount
            )
        );
    }, [
        orderDetail.advancePaid,
        orderDetail.discount,
        form.formState.isDirty,
        orderItems,
        customItems,
        dispatch,
        form,
    ]);

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Order Summary</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            Order Items
                        </h2>

                        {orderItems.length === 0 && customItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center">
                                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                                    <Info size={15} /> No items in your order.
                                </span>
                            </div>
                        ) : (
                            <div className="max-h-52 overflow-y-scroll scrollbar-thin">
                                {orderItems.map((item, i) => (
                                    <FinalItemCard item={item} key={i} />
                                ))}
                                {customItems.map((item, i) => (
                                    <FinalCustomItemCard
                                        item={item}
                                        key={i + item.name}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Payment</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between">
                                    <span>
                                        Tax{" "}
                                        <i className="text-xs text-muted-foreground">
                                            &#040;
                                            {process.env.NEXT_PUBLIC_TAX_AMOUNT}
                                            %&#041;
                                        </i>
                                    </span>
                                    <span>${orderDetail.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        checked={noTax}
                                        onChange={() => setNoTax(!noTax)}
                                        size="sm"
                                        classNames={{
                                            label: "text-xs text-muted-foreground",
                                        }}
                                    >
                                        Remove tax
                                    </Checkbox>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Charge</span>
                                <span>${orderDetail.deliveryCharge}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Advance Paid</span>
                                <span>
                                    {orderDetail.advancePaid > 0 && "-"} $
                                    {orderDetail.advancePaid}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span>
                                    {orderDetail.discount > 0 && "-"} $
                                    {orderDetail.discount}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total</span>
                                <span>
                                    ${orderDetail.totalPrice.toFixed(2)}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold">
                                <span>Pending Pay</span>
                                <span
                                    className={
                                        orderDetail.pendingBalance < 0
                                            ? "text-red-500"
                                            : ""
                                    }
                                >
                                    ${orderDetail.pendingBalance.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Address</h2>
                        {address.firstName && address.phone ? (
                            <div className="space-y-2">
                                <p className="font-medium">
                                    {address.firstName} {address.lastName}
                                </p>
                                <p>{address.phone}</p>
                                <p>{address.address}</p>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>
                                        Delivery on{" "}
                                        {formatDate(address.deliveryDate)}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <CreditCard className="w-4 h-4" />
                                    <span className="capitalize">
                                        {address.paymentMethod}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <span className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
                                <Info size={15} />
                                Please fill the address from
                            </span>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            Additional Details
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="advance-amount">
                                    Delivery Charge
                                </Label>
                                <Input
                                    id="delivery-charge"
                                    type="number"
                                    step=""
                                    placeholder="Enter delivery charge"
                                    value={orderDetail.deliveryCharge}
                                    onChange={handleDeliveryChargeChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="advance-amount">
                                    Advance Amount
                                </Label>
                                <Input
                                    id="advance-amount"
                                    type="number"
                                    step=""
                                    placeholder="Enter advance amount"
                                    value={orderDetail.advancePaid}
                                    onChange={handleAdvanceChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discount-amount">
                                    Discount
                                </Label>
                                <Input
                                    id="discount-amount"
                                    type="number"
                                    step=""
                                    placeholder="Enter a discount amount"
                                    value={orderDetail.discount}
                                    onChange={handleDiscountChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="note">Note</Label>
                                <Textarea
                                    id="note"
                                    value={orderDetail.note}
                                    onChange={(e) =>
                                        dispatch(setNote(e.target.value))
                                    }
                                    placeholder="Enter any additional notes"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
