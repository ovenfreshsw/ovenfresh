import { CalendarDays, Pencil } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import LoadingButton from "../ui/loading-button";
import { ZodGrocerySchema } from "@/lib/zod-schema/schema";
import { toast } from "sonner";
import { useState } from "react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { GroceryDocument } from "@/models/types/grocery";
import { DateInput } from "@heroui/date-input";
import { format } from "date-fns";
import { editGroceryAction } from "@/actions/edit-grocery-action";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Checkbox } from "@heroui/checkbox";

const EditGroceryDialog = ({ grocery }: { grocery: GroceryDocument }) => {
    const [loading, setLoading] = useState(false);
    const [mixed, setMixed] = useState(grocery.unit === "Mixed" ? true : false);

    function handleSubmit(formData: FormData) {
        setLoading(true);

        if (mixed) {
            formData.set("mixed", "true");
            formData.set("quantity", "0");
            formData.set("unit", "none");
        }

        const data = Object.fromEntries(formData);

        const result = ZodGrocerySchema.safeParse(data);
        if (!result.success) {
            toast.error("Invalid data format.");
            setLoading(false);
            return;
        }

        formData.set("id", grocery._id);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await editGroceryAction(formData);
                setLoading(false);
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Updating grocery...",
            success: () => "Grocery item updated successfully.",
            error: ({ error }) => (error ? error : "Failed to update item."),
        });
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button>
                    <Pencil
                        size={18}
                        className="stroke-2 text-muted-foreground"
                    />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Grocery</DialogTitle>
                </DialogHeader>
                <form
                    id="edit-grocery-form"
                    action={handleSubmit}
                    className="grid gap-4 py-4"
                >
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="item" className="text-right">
                            Item
                        </Label>
                        <Input
                            placeholder="Item"
                            name="item"
                            className="col-span-3"
                            defaultValue={grocery.item}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="quantity" className="text-right">
                            Quantity
                        </Label>
                        <Input
                            placeholder="Quantity"
                            name="quantity"
                            className="col-span-1"
                            type="number"
                            min="0"
                            step="0.01"
                            disabled={mixed}
                            defaultValue={grocery.quantity}
                        />
                        <Select
                            name="unit"
                            defaultValue={grocery.unit}
                            disabled={mixed}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent className="z-[1550]">
                                <SelectItem value="L">L</SelectItem>
                                <SelectItem value="Kg">Kg</SelectItem>
                                <SelectItem value="g">g</SelectItem>
                                <SelectItem value="lbs">lbs</SelectItem>
                                <SelectItem value="Pcs">Pcs</SelectItem>
                                <SelectItem value="Nos">Nos</SelectItem>
                                <SelectItem value="none">none</SelectItem>
                            </SelectContent>
                        </Select>
                        <Checkbox
                            size="sm"
                            isSelected={mixed}
                            onValueChange={setMixed}
                        >
                            Mixed
                        </Checkbox>
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="price" className="text-right">
                            Price
                        </Label>
                        <Input
                            placeholder="Price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            className="col-span-3"
                            defaultValue={grocery.price}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="tax" className="text-right">
                            Tax
                        </Label>
                        <Input
                            placeholder="Tax"
                            name="tax"
                            type="number"
                            min="0"
                            step="0.01"
                            className="col-span-3"
                            defaultValue={grocery.tax}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="total" className="text-right">
                            Total amount
                        </Label>
                        <Input
                            placeholder="Total Amount"
                            name="total"
                            type="number"
                            min="0"
                            step="0.01"
                            className="col-span-3"
                            defaultValue={grocery.total}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="date" className="text-right">
                            Date
                        </Label>
                        <DateInput
                            defaultValue={parseDate(
                                format(new Date(grocery.date), "yyyy-MM-dd")
                            )}
                            endContent={<CalendarDays />}
                            placeholderValue={new CalendarDate(1995, 11, 6)}
                            name="date"
                            aria-label="Date"
                            className="col-span-3"
                            classNames={{
                                inputWrapper:
                                    "bg-white border rounded-lg hover:bg-white",
                            }}
                        />
                    </div>
                </form>
                <DialogFooter className="flex justify-end">
                    <LoadingButton
                        isLoading={loading}
                        size={"sm"}
                        type="submit"
                        form="edit-grocery-form"
                    >
                        Update
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditGroceryDialog;
