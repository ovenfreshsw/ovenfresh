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
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { QueryClient } from "@tanstack/react-query";
import { useConfirmDelivery } from "@/api-hooks/delivery/confirm-delivery";
import { CloudinaryUploadWidgetInfo } from "next-cloudinary";

export function ConfirmDeliveryDrawer({
    orderType,
    orderId,
    disabled = false,
    resource,
}: {
    orderType: "catering" | "tiffin";
    orderId: string;
    disabled?: boolean;
    resource?: string | CloudinaryUploadWidgetInfo | undefined;
}) {
    const [open, setOpen] = React.useState(false);

    function onSuccess(queryClient: QueryClient) {
        queryClient.invalidateQueries({
            queryKey: ["delivery", "sortedOrders", orderType],
        });
        toast.success("Order delivered successfully!");
        setOpen(false);
    }

    const mutation = useConfirmDelivery(onSuccess);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    size="sm"
                    className="flex items-center"
                    disabled={disabled}
                >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Delivered
                </Button>
            </DrawerTrigger>
            <DrawerContent className="z-[1550] max-w-md mx-auto">
                <DrawerHeader className="text-left">
                    <DialogTitle>Confirm delivery?</DialogTitle>
                    <DrawerDescription>
                        Are you sure you want to mark this order as delivered?
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="pt-2">
                    <LoadingButton
                        isLoading={mutation.isPending}
                        onClick={() =>
                            mutation.mutate({ orderId, orderType, resource })
                        }
                        className="w-full"
                    >
                        Mark as delivered
                    </LoadingButton>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
