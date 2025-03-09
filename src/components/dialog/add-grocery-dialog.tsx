import { CalendarDays, Plus } from "lucide-react";
import { Button } from "../ui/button";
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
import { toast } from "sonner";
import { useState } from "react";
import { ZodGrocerySchema } from "@/lib/zod-schema/schema";
import { addGroceryAction } from "@/actions/add-grocery-action";
import { DateInput } from "@heroui/date-input";
import { CalendarDate } from "@internationalized/date";

const AddGroceryDialog = () => {
    const [loading, setLoading] = useState(false);

    function handleSubmit(formData: FormData) {
        setLoading(true);

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
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"sm"} className="flex items-center gap-2">
                    <Plus />
                    Add grocery
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add new item</DialogTitle>
                </DialogHeader>
                <form
                    id="add-grocery-form"
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
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="quantity" className="text-right">
                            Quantity
                        </Label>
                        <Input
                            placeholder="Quantity"
                            name="quantity"
                            className="col-span-3"
                        />
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
                        <Label htmlFor="date" className="text-right">
                            Date
                        </Label>
                        <DateInput
                            aria-label="Date"
                            endContent={<CalendarDays />}
                            placeholderValue={new CalendarDate(1995, 11, 6)}
                            name="date"
                            className="col-span-3"
                        />
                    </div>
                </form>
                <DialogFooter className="flex justify-end">
                    <LoadingButton
                        isLoading={loading}
                        size={"sm"}
                        type="submit"
                        form="add-grocery-form"
                    >
                        Create
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddGroceryDialog;
