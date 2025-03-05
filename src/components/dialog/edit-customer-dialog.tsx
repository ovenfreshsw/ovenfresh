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
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { editCustomerAction } from "@/actions/edit-customer-action";
import { PhoneInput } from "../ui/phone-input";
import { useState } from "react";
import { Textarea } from "../ui/textarea";

const EditCustomerDialog = ({
    orderId,
    nameAtOrder,
    phoneAtOrder,
    orderType,
    note,
}: {
    orderId: string;
    nameAtOrder: string;
    phoneAtOrder: string;
    orderType: "catering" | "tiffin";
    note: string;
}) => {
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (formData: FormData) => {
        formData.append("orderId", orderId);
        formData.append("orderType", orderType);

        setLoading(true);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await editCustomerAction(formData);
                setLoading(false);
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Updating customer details...",
            success: () => "Customer details updated successfully.",
            error: "Failed to update customer details.",
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button isIconOnly variant="flat" radius="full" size="sm">
                    <Pencil size={15} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit customer details</DialogTitle>
                </DialogHeader>
                <form
                    id="edit-customer-form"
                    action={handleSubmit}
                    className="grid gap-4 py-4"
                >
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="firstName" className="text-right">
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            defaultValue={nameAtOrder.split(" ")[0]}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lastName" className="text-right">
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            defaultValue={nameAtOrder.split(" ")[1]}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone
                        </Label>
                        <PhoneInput
                            placeholder="phone"
                            id="phone"
                            name="phone"
                            value={phoneAtOrder}
                            defaultCountry="CA"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="note" className="text-right">
                            Note
                        </Label>
                        <Textarea
                            id="note"
                            name="note"
                            defaultValue={note}
                            placeholder="Enter a note (Optional)"
                            className="col-span-3"
                        />
                    </div>
                </form>
                <DialogFooter>
                    <ShadButton
                        disabled={loading}
                        form="edit-customer-form"
                        type="submit"
                    >
                        Save changes
                    </ShadButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditCustomerDialog;
