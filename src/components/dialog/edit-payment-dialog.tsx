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
import { Pencil, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { editPaymentAction } from "@/actions/edit-payment-action";

const EditPaymentDialog = ({
    orderId,
    paymentDetails,
    orderType,
}: {
    orderId: string;
    paymentDetails: {
        subtotal: number;
        tax: number;
        deliveryCharge: number;
        paymentMethod: string;
        advancePaid: number;
        pendingBalance: number;
        fullyPaid: boolean;
    };
    orderType: "catering" | "tiffin";
}) => {
    const [loading, setLoading] = useState(false);
    const [tax, setTax] = useState(paymentDetails.tax);
    const [fullyPaid, setFullyPaid] = useState(
        paymentDetails.fullyPaid.toString()
    );
    const [subtotal, setSubtotal] = useState(paymentDetails.subtotal);

    const handleSubmit = async (formData: FormData) => {
        formData.append("orderId", orderId);
        formData.append("orderType", orderType);
        formData.append("tax", tax.toString());

        setLoading(true);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await editPaymentAction(formData);
                setLoading(false);
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Updating payment details...",
            success: () => {
                return "Payment details updated successfully.";
            },
            error: "Failed to update payment details.",
        });
    };

    function calculateTax() {
        const tax =
            (subtotal * Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0)) / 100;
        setTax(tax);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button isIconOnly variant="flat" radius="full" size="sm">
                    <Pencil size={15} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-scroll scrollbar-thin">
                <DialogHeader>
                    <DialogTitle>Edit payment details</DialogTitle>
                </DialogHeader>
                <form
                    id="edit-payment-form"
                    action={handleSubmit}
                    className="grid gap-4 py-4"
                >
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="subtotal" className="text-right">
                            Subtotal{" "}
                        </Label>
                        <Input
                            id="subtotal"
                            name="subtotal"
                            type="number"
                            min={0}
                            step={"any"}
                            value={subtotal}
                            onChange={(e) =>
                                setSubtotal(Number(e.target.value))
                            }
                            // defaultValue={paymentDetails.subtotal}
                            className="col-span-2"
                        />
                    </div>
                    {orderType === "catering" && (
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label
                                htmlFor="deliveryCharge"
                                className="text-right"
                            >
                                Delivery fee
                            </Label>
                            <Input
                                id="deliveryCharge"
                                name="deliveryCharge"
                                type="number"
                                min={0}
                                step={"any"}
                                defaultValue={paymentDetails.deliveryCharge}
                                className="col-span-2"
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="total" className="text-right">
                            Total{" "}
                            <span className="text-xs text-muted-foreground">
                                &#040;incl. tax&#041;
                            </span>
                        </Label>
                        <Input
                            id="total"
                            name="total"
                            type="number"
                            min={0}
                            step={"any"}
                            defaultValue={
                                paymentDetails.subtotal +
                                paymentDetails.tax +
                                (paymentDetails.deliveryCharge || 0)
                            }
                            className="col-span-2"
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="tax" className="text-right">
                            Tax
                        </Label>
                        <Input
                            id="tax"
                            name="tax"
                            type="number"
                            min={0}
                            step={"any"}
                            value={tax}
                            onChange={(e) => setTax(Number(e.target.value))}
                        />
                        <ShadButton
                            onClick={calculateTax}
                            variant={"outline"}
                            size="sm"
                            type="button"
                        >
                            Calculate
                        </ShadButton>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="paymentMethod" className="text-right">
                            Payment Method
                        </Label>
                        <Select
                            defaultValue={paymentDetails.paymentMethod}
                            name="paymentMethod"
                        >
                            <SelectTrigger
                                id="paymentMethod"
                                className="col-span-2"
                            >
                                <SelectValue placeholder="payment" />
                            </SelectTrigger>
                            <SelectContent className="z-[1560]">
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="card">Card</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="advancePaid" className="text-right">
                            Advance Paid
                        </Label>
                        <Input
                            id="advancePaid"
                            name="advancePaid"
                            type="number"
                            min={0}
                            step={"any"}
                            defaultValue={paymentDetails.advancePaid}
                            className="col-span-2"
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="pendingBalance" className="text-right">
                            Pending Balance
                        </Label>
                        <Input
                            id="pendingBalance"
                            name="pendingBalance"
                            type="number"
                            min={0}
                            step={"any"}
                            defaultValue={paymentDetails.pendingBalance}
                            className="col-span-2"
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="fullyPaid" className="text-right">
                            Fully paid
                        </Label>
                        <Select
                            value={fullyPaid}
                            onValueChange={(value) => setFullyPaid(value)}
                            name="fullyPaid"
                        >
                            <SelectTrigger
                                id="fullyPaid"
                                className="col-span-2"
                            >
                                <SelectValue placeholder="fully paid" />
                            </SelectTrigger>
                            <SelectContent className="z-[1560]">
                                <SelectItem value="true">Yes</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <span className="text-xs text-yellow-700 bg-yellow-500/20 p-1 rounded-md flex items-center gap-2">
                        <TriangleAlert className="flex-shrink-0 size-4 ms-0.5" />
                        Values are not synced automatically. Please ensure all
                        amounts are manually updated.
                    </span>
                </form>
                <DialogFooter>
                    <ShadButton
                        disabled={loading}
                        form="edit-payment-form"
                        type="submit"
                    >
                        Save changes
                    </ShadButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditPaymentDialog;
