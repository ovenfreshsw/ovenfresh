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
import LoadingButton from "../ui/loading-button";
import { useState } from "react";
import GroceryForm from "../forms/grocery-form";

const AddGroceryDialog = () => {
    const [loading, setLoading] = useState(false);
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
                <GroceryForm setLoading={setLoading} />
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
