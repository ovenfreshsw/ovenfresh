import { Trash2 } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import LoadingButton from "../ui/loading-button";
import { deleteCateringMenuAction } from "@/actions/delete-catering-menu-action";

const DeleteCateringMenuDialog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(false);

    function handleSubmit() {
        setLoading(true);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await deleteCateringMenuAction(id);
                setLoading(false);
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Deleting item...",
            success: () => "Menu item deleted successfully.",
            error: ({ error }) => (error ? error : "Failed to delete item."),
        });
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button>
                    <Trash2 size={18} className="stroke-2 text-danger" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription className="text-sm">
                        This action cannot be undone. This will permanently
                        delete this menu item from the server.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            variant="ghost"
                            className="bg-destructive/10 text-destructive hover:bg-destructive/30 hover:text-destructive"
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <LoadingButton isLoading={loading} onClick={handleSubmit}>
                        Continue
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteCateringMenuDialog;
