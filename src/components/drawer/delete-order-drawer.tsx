"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTrigger,
} from "@/components/ui/drawer";
import LoadingButton from "@/components/ui/loading-button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteOrder } from "@/api-hooks/delete-order";
import { QueryClient } from "@tanstack/react-query";
import { useMediaQuery } from "@mui/material";

export function DeleteOrderDrawer({
    orderId,
    orderType,
}: {
    orderId: string;
    orderType: "catering" | "tiffin";
}) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    function onSuccess(queryClient: QueryClient) {
        queryClient.invalidateQueries({ queryKey: ["order", orderType] });
        toast.success("Order deleted successfully!");
        setOpen(false);
    }

    const mutation = useDeleteOrder(onSuccess);

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button>
                        <Trash2 size={18} className="stroke-2 text-red-500" />
                    </button>
                </DialogTrigger>
                <DialogContent className="flex flex-col z-[1550]">
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription className="text-sm">
                            This action cannot be undone. This will permanently
                            delete this order and remove all data from the
                            server.
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
                        <LoadingButton
                            isLoading={mutation.isPending}
                            onClick={() =>
                                mutation.mutate({ orderId, orderType })
                            }
                        >
                            Continue
                        </LoadingButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button>
                    <Trash2 size={18} className="stroke-2 text-red-500" />
                </button>
            </DrawerTrigger>
            <DrawerContent className="z-[1550]">
                <DrawerHeader className="text-left">
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DrawerDescription>
                        This action cannot be undone. This will permanently
                        delete this order and remove all data from the server.
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button
                            variant="ghost"
                            className="bg-destructive/10 text-destructive hover:bg-destructive/30 hover:text-destructive"
                        >
                            Cancel
                        </Button>
                    </DrawerClose>
                    <LoadingButton
                        isLoading={mutation.isPending}
                        onClick={() => mutation.mutate({ orderId, orderType })}
                    >
                        Continue
                    </LoadingButton>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
