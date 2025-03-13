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
import LoadingButton from "../ui/loading-button";
import { toast } from "sonner";
import { useState } from "react";
import { addCategoryAction } from "@/actions/add-category-action";

const AddCategoryDialog = () => {
    const [loading, setLoading] = useState(false);

    function handleSubmit(formData: FormData) {
        setLoading(true);

        const { name } = Object.fromEntries(formData);
        if (!name) {
            toast.error("Invalid data format.");
            setLoading(false);
            return;
        }

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await addCategoryAction(formData);
                setLoading(false);
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Creating category...",
            success: () => "Category created successfully.",
            error: ({ error }) =>
                error ? error : "Failed to create category.",
        });
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"sm"} className="flex items-center gap-2">
                    <Plus />
                    Add category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add new category</DialogTitle>
                </DialogHeader>
                <form
                    id="add-category-form"
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
                </form>
                <DialogFooter className="flex justify-end">
                    <LoadingButton
                        isLoading={loading}
                        size={"sm"}
                        type="submit"
                        form="add-category-form"
                    >
                        Create
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddCategoryDialog;
