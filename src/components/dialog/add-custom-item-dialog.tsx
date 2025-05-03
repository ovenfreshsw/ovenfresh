import { Plus } from "lucide-react";
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
import { addItem } from "@/store/slices/cateringCustomItemSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const AddCustomItemDialog = () => {
    const dispatch = useDispatch();
    function handleSubmit(formData: FormData) {
        const { name, priceAtOrder, size } = Object.fromEntries(formData);
        if (!name || !priceAtOrder || !size) {
            toast.error("Invalid data format.");
            return;
        }
        dispatch(
            addItem({
                name: name as string,
                priceAtOrder: Number(priceAtOrder),
                size: size as string,
            })
        );
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"sm"} className="flex items-center gap-2">
                    <Plus />
                    Add custom items
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add custom item</DialogTitle>
                </DialogHeader>
                <form
                    id="add-custom-item-form"
                    action={handleSubmit}
                    className="grid gap-4 py-4"
                >
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            placeholder="Name"
                            name="name"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="size" className="text-right">
                            Size
                        </Label>
                        <Input
                            placeholder="5 PPL"
                            name="size"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="priceAtOrder" className="text-right">
                            Price
                        </Label>
                        <Input
                            placeholder="$99"
                            name="priceAtOrder"
                            className="col-span-3"
                        />
                    </div>
                </form>
                <DialogFooter className="flex justify-end">
                    <Button
                        size={"sm"}
                        type="submit"
                        form="add-custom-item-form"
                    >
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddCustomItemDialog;
