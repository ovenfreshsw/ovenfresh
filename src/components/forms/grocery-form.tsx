import { DateInput } from "@heroui/date-input";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ZodGrocerySchema } from "@/lib/zod-schema/schema";
import { toast } from "sonner";
import { addGroceryAction } from "@/actions/add-grocery-action";
import { CalendarDate } from "@internationalized/date";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@heroui/checkbox";
import { useState } from "react";

const GroceryForm = ({
    setLoading,
}: {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [box, setBox] = useState(false);
    function handleSubmit(formData: FormData) {
        setLoading(true);

        if (box) {
            formData.set("box", "true");
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

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await addGroceryAction(formData);
                setLoading(false);
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Adding grocery...",
            success: () => "Grocery item added successfully.",
            error: ({ error }) => (error ? error : "Failed to add grocery."),
        });
    }
    return (
        <form
            id="add-grocery-form"
            action={handleSubmit}
            className="grid gap-4 py-4"
        >
            <div className="grid grid-cols-4 gap-2 items-center">
                <Label htmlFor="item" className="text-right">
                    Item
                </Label>
                <Input placeholder="Item" name="item" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
                <Label htmlFor="quantity" className="text-right">
                    Quantity
                </Label>
                <Input
                    placeholder="Quantity"
                    name="quantity"
                    disabled={box}
                    className="col-span-1"
                />
                <Select name="unit" disabled={box}>
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
                <Checkbox size="sm" checked={box} onValueChange={setBox}>
                    Box
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
                />
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
                <Label htmlFor="purchasedFrom" className="text-right">
                    Purchased from
                </Label>
                <Input
                    placeholder="Store name"
                    name="purchasedFrom"
                    type="text"
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
                <Label htmlFor="date" className="text-right">
                    Date
                </Label>
                <DateInput
                    aria-label="Date"
                    placeholderValue={new CalendarDate(1995, 11, 6)}
                    name="date"
                    className="col-span-3"
                />
            </div>
        </form>
    );
};

export default GroceryForm;
