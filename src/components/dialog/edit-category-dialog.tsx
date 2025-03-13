import { Pencil } from "lucide-react";
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
import { Button } from "@heroui/button";

const EditCategoryDialog = ({ id, name }: { id: string; name: string }) => {
    const [loading, setLoading] = useState(false);

    function handleSubmit(formData: FormData) {
        setLoading(true);

        formData.append("id", id);

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
            loading: "Updating category...",
            success: () => "Updating created successfully.",
            error: ({ error }) =>
                error ? error : "Failed to update category.",
        });
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button isIconOnly variant="flat" radius="full" size="sm">
                    <Pencil size={15} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit category</DialogTitle>
                </DialogHeader>
                <form
                    id="edit-category-form"
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
                            defaultValue={name}
                        />
                    </div>
                </form>
                <DialogFooter className="flex justify-end">
                    <LoadingButton
                        isLoading={loading}
                        size={"sm"}
                        type="submit"
                        form="edit-category-form"
                    >
                        Update
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditCategoryDialog;
