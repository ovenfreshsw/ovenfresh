"use client";

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
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";
import { CateringDocument } from "@/models/types/catering";
import { generateOrderId } from "@/lib/utils";

const AddCustomItemDirectDialog = ({
    children,
    setCustomItems,
    enableSaveButton,
}: {
    children: React.ReactNode;
    setCustomItems: Dispatch<SetStateAction<CateringDocument["customItems"]>>;
    enableSaveButton: Dispatch<SetStateAction<boolean>>;
}) => {
    function handleSubmit(formData: FormData) {
        const { name, priceAtOrder, size } = Object.fromEntries(formData);
        if (!name || !priceAtOrder || !size) {
            toast.error("Invalid data format.");
            return;
        }

        setCustomItems((prev) => [
            ...prev,
            {
                _id: generateOrderId(),
                name: name as string,
                size: size as string,
                priceAtOrder: Number(priceAtOrder),
            },
        ]);

        enableSaveButton(true);
    }
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add custom item</DialogTitle>
                </DialogHeader>
                <form
                    id="add-custom-item-direct-form"
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
                        form="add-custom-item-direct-form"
                    >
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddCustomItemDirectDialog;
