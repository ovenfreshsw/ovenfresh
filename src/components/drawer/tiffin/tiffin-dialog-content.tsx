import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { ZodTiffinSchema } from "@/lib/zod-schema/schema";
import { Checkbox } from "@heroui/checkbox";
import {
    CalendarIcon,
    CreditCardIcon,
    MapPinIcon,
    PhoneIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

type TiffinDialogContentProps = {
    form: UseFormReturn<z.infer<typeof ZodTiffinSchema>>;
    advanceAmount: string;
    handleAdvanceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    note: string;
    setNote: React.Dispatch<React.SetStateAction<string>>;
    pendingAmount: number;
    setPendingAmount: React.Dispatch<React.SetStateAction<number>>;
};

const TiffinDialogContent = ({
    form,
    advanceAmount,
    note,
    setNote,
    handleAdvanceChange,
    pendingAmount,
    setPendingAmount,
}: TiffinDialogContentProps) => {
    const [noTax, setNoTax] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);

    useEffect(() => {
        const total = Number(form.getValues("totalAmount"));
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0);

        const subtotal = (total * 100) / (100 + taxRate);
        setSubtotal(subtotal);
        const tax = (total * taxRate) / (100 + taxRate);
        setTax(tax);

        if (noTax) {
            form.setValue("tax", 0, { shouldValidate: true });
            setPendingAmount(total - Number(advanceAmount) - tax);
        } else {
            form.setValue("tax", tax, { shouldValidate: true });
            setPendingAmount(total - Number(advanceAmount));
        }
    }, [form, setPendingAmount, noTax, advanceAmount, setSubtotal]);

    const orderDetails = {
        firstName: form.getValues("customerDetails.firstName"),
        lastName: form.getValues("customerDetails.lastName"),
        phone: form.getValues("customerDetails.phone"),
        address: form.getValues("customerDetails.address"),
        startDate: formatDate(new Date(form.getValues("start_date"))),
        endDate: formatDate(new Date(form.getValues("end_date"))),
        numberOfWeeks: form.getValues("number_of_weeks"),
        paymentMethod: form.getValues("payment_method"),
        totalAmount:
            form.getValues("tax") === 0
                ? (Number(form.getValues("totalAmount")) - tax).toString()
                : form.getValues("totalAmount"),
        tax: form.getValues("tax"),
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Customer Details</h3>
                    <p className="text-sm font-semibold">
                        {orderDetails.firstName} {orderDetails.lastName}
                    </p>
                    <p className="text-sm flex items-center">
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        {orderDetails.phone}
                    </p>
                    <p className="text-sm flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                        {orderDetails.address}
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Order Details</h3>
                    <p className="text-sm flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Start Date: {orderDetails.startDate}
                    </p>
                    <p className="text-sm flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        End Date: {orderDetails.endDate}
                    </p>
                    <p className="text-sm">
                        Number of Weeks: {orderDetails.numberOfWeeks}
                    </p>
                    <p className="text-sm flex items-center">
                        <CreditCardIcon className="w-4 h-4 mr-2" />
                        Payment Method: {orderDetails.paymentMethod}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <div>
                    <Label htmlFor="advance-amount">Advance Amount</Label>
                    <Input
                        id="advance-amount"
                        type="number"
                        placeholder="Enter advance amount"
                        value={advanceAmount}
                        onChange={handleAdvanceChange}
                    />
                </div>
                <div>
                    <Label htmlFor="note">Note</Label>
                    <Textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Enter a note (Optional)"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Price Summary</h3>
                <p className="text-sm font-semibold flex justify-between">
                    Subtotal: <span>${subtotal.toFixed(2)}</span>
                </p>
                <p className="text-sm flex flex-col">
                    <span className="flex items-center gap-1 justify-between">
                        Tax:{" "}
                        <span>
                            {orderDetails.tax === 0
                                ? `- $${tax.toFixed(2)}`
                                : `$${orderDetails.tax.toFixed(2)}`}
                        </span>
                    </span>
                    <span>
                        <Checkbox
                            size="sm"
                            checked={noTax}
                            onChange={() => setNoTax(!noTax)}
                            classNames={{
                                label: "text-xs text-muted-foreground",
                            }}
                        >
                            Remove tax
                        </Checkbox>
                    </span>
                </p>
                <p className="text-sm font-semibold flex justify-between">
                    Total Amount:{" "}
                    <span>${Number(orderDetails.totalAmount).toFixed(2)}</span>
                </p>
                <p className="text-sm flex justify-between">
                    Advance Paid:{" "}
                    <span>
                        {Number(advanceAmount) !== 0 && "- "}$
                        {advanceAmount === "" ? 0 : advanceAmount}
                    </span>
                </p>
                <p className="text-sm font-semibold flex justify-between">
                    Pending Amount: <span>${pendingAmount.toFixed(2)}</span>
                </p>
            </div>
        </div>
    );
};

export default TiffinDialogContent;
