import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../../ui/drawer";
import { Package } from "lucide-react";
import { useState } from "react";

const OrderItemsDrawer = ({
    items,
    customItems,
    orderId,
}: {
    items: { name: string; quantity: number }[];
    customItems: { name: string; size: string }[];
    orderId: string;
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const totalItems =
        items.reduce((sum, item) => sum + item.quantity, 0) +
        customItems.length;
    return (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                    <Package className="h-4 w-4 mr-2" />
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="mx-auto max-w-md">
                <div>
                    <DrawerHeader>
                        <DrawerTitle>Order Items</DrawerTitle>
                        <DrawerDescription>Order #{orderId}</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                        <div className="space-y-4 max-h-96 overflow-y-scroll scrollbar-thin">
                            {items.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                            <span className="font-medium text-sm">
                                                {item.quantity}x
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {item.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {customItems.map((item, i) => (
                                <div
                                    key={item.name + i}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                            <span className="font-medium text-sm">
                                                x
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-0">
                                            <p className="font-medium">
                                                {item.name}
                                            </p>
                                            <span className="text-xs">
                                                {item.size}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {items.length === 0 && customItems.length === 0 && (
                                <div className="text-center py-6 text-muted-foreground">
                                    No items in this order
                                </div>
                            )}
                        </div>

                        {/* {items.length > 0 && (
                            <>
                                <Separator className="my-4" />
                                <div className="flex justify-between items-center font-medium">
                                    <p>Total</p>
                                    <p>
                                        $
                                        {items
                                            .reduce(
                                                (sum, item) =>
                                                    sum +
                                                    item.price * item.quantity,
                                                0
                                            )
                                            .toFixed(2)}
                                    </p>
                                </div>
                            </>
                        )} */}
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default OrderItemsDrawer;
