import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { CateringItemsState } from "@/lib/types/catering/catering-order-state";

export function PaymentDetailsDrawer() {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const cateringOrder = useSelector((state: RootState) => state.cateringItem);

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant={"link"}
                        size={"sm"}
                        className="underline"
                        disabled={!cateringOrder.length}
                        type="button"
                    >
                        View payment details
                    </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col max-w-xl z-[1550]">
                    <DialogHeader>
                        <DialogTitle>Payment details</DialogTitle>
                    </DialogHeader>
                    <PaymentDialogContent cateringOrder={cateringOrder} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button
                    variant={"link"}
                    size={"sm"}
                    className="underline"
                    type="button"
                >
                    View payment details
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Payment details</DrawerTitle>
                </DrawerHeader>
                <div className="px-4">
                    <PaymentDialogContent cateringOrder={cateringOrder} />
                </div>
                <DrawerFooter />
            </DrawerContent>
        </Drawer>
    );
}

function PaymentDialogContent({
    cateringOrder,
}: {
    cateringOrder: CateringItemsState[];
}) {
    const total = cateringOrder.reduce(
        (acc, item) => acc + item.priceAtOrder * item.quantity,
        0
    );
    const tax = total * 0.05;
    const totalPayment = total + tax;
    return (
        <div className="bg-gray-100 rounded-md p-2 mt-1">
            <h2 className="text-xl mb-4">Payment Summary</h2>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Sub Total</span>
                    <span className="font-medium">${total}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Payment</span>
                    <span className="font-medium">
                        ${totalPayment.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
