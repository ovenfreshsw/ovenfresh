"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTrigger,
} from "@/components/ui/drawer";
import LoadingButton from "@/components/ui/loading-button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AddOrderDrawer() {
    const [open, setOpen] = React.useState(false);

    // function onSuccess(queryClient: QueryClient) {
    //     queryClient.invalidateQueries({
    //         queryKey: ["delivery", "sortedOrders", orderType],
    //     });
    //     toast.success("Order delivered successfully!");
    //     setOpen(false);
    // }

    // const mutation = useConfirmDelivery(onSuccess);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    size={"icon"}
                    className="rounded-full size-11 shadow-lg"
                    variant={"outline"}
                >
                    <Plus />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="z-[1550] max-w-md mx-auto">
                <DrawerHeader className="text-left">
                    <DialogTitle>Add order</DialogTitle>
                    <DrawerDescription>
                        Enter the order ID you want to add to the delivery.
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="pt-2">
                    <Input placeholder="Enter order ID" />
                    <LoadingButton
                        isLoading={false}
                        // isLoading={mutation.isPending}
                        // onClick={() => mutation.mutate({ orderId, orderType })}
                        className="w-full"
                    >
                        Add Order
                    </LoadingButton>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
