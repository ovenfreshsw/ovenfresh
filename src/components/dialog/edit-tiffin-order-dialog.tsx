"use client";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button as ShadButton } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Checkbox } from "@heroui/checkbox";
import { editTiffinOrderAction } from "@/actions/edit-tiffin-order-action";

const EditTiffinOrderDialog = ({
    orderId,
    startDate,
    numberOfWeeks,
    type,
    tax,
    advancePaid,
}: {
    orderId: string;
    startDate: Date;
    numberOfWeeks: number;
    type: "pickup" | "delivery";
    tax: number;
    advancePaid: number;
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderType, setOrderType] = useState(type);
    const [nWeeks, setNWeeks] = useState(numberOfWeeks);
    const [updateEndDate, setUpdateEndDate] = useState(true);

    const handleSubmit = async (formData: FormData) => {
        formData.append("orderId", orderId);
        formData.append("startDate", startDate as unknown as string);
        formData.append("updateEndDate", updateEndDate.toString());
        formData.append("numberOfWeeks", nWeeks.toString());
        formData.append("order_type", orderType);
        formData.append("tax", tax.toString());
        formData.append("advancePaid", advancePaid.toString());

        setLoading(true);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await editTiffinOrderAction(formData);

                setLoading(false);
                setOpen(false);
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Updating order details...",
            success: () => "Order details updated successfully.",
            error: (error) => {
                return error.error || "Failed to update order details.";
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button isIconOnly variant="flat" radius="full" size="sm">
                    <Pencil size={15} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Order type details</DialogTitle>
                </DialogHeader>
                <form
                    id="edit-tiffin-order-type-form"
                    action={handleSubmit}
                    className="grid gap-4 py-4"
                >
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="numberOfWeeks" className="text-right">
                            Number of weeks
                        </Label>
                        <Select
                            value={nWeeks.toString()}
                            onValueChange={(value) => setNWeeks(Number(value))}
                        >
                            <div className="col-span-3">
                                <SelectTrigger id="numberOfWeeks">
                                    <SelectValue placeholder="number of weeks" />
                                </SelectTrigger>
                                <Checkbox
                                    size="sm"
                                    radius="sm"
                                    isSelected={updateEndDate}
                                    onValueChange={setUpdateEndDate}
                                    classNames={{
                                        label: "text-xs text-muted-foreground",
                                        base: "rounded-md",
                                    }}
                                >
                                    Update End date with number of weeks
                                </Checkbox>
                            </div>
                            <SelectContent className="z-[1560]">
                                <SelectItem value="2">2 weeks</SelectItem>
                                <SelectItem value="3">3 weeks</SelectItem>
                                <SelectItem value="4">4 weeks</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="order_type" className="text-right">
                            Order Type
                        </Label>
                        <Select
                            value={orderType}
                            onValueChange={(value) =>
                                setOrderType(value as "pickup" | "delivery")
                            }
                        >
                            <SelectTrigger
                                id="order_type"
                                className="col-span-3"
                            >
                                <SelectValue placeholder="order type" />
                            </SelectTrigger>
                            <SelectContent className="z-[1560]">
                                <SelectItem value="pickup">Pickup</SelectItem>
                                <SelectItem value="delivery">
                                    Delivery
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </form>
                <DialogFooter>
                    <ShadButton
                        disabled={loading}
                        form="edit-tiffin-order-type-form"
                        type="submit"
                    >
                        Save changes
                    </ShadButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditTiffinOrderDialog;
