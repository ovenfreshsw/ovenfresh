"use client";

import * as React from "react";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Button as HeroButton } from "@heroui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { useCateringMenu } from "@/api-hooks/catering/get-catering-menu";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clearState } from "@/store/slices/cateringItemSlice";
import { useAddItems } from "@/api-hooks/catering/add-items";
import { CateringMenuDocumentPopulate } from "@/models/types/catering-menu";
import { revalidateOrder } from "@/actions/revalidate-order";

export function AddItemDrawer({
    orderId,
    existingItems,
}: {
    orderId: string;
    existingItems: string[];
}) {
    const [open, setOpen] = React.useState(false);
    const [filterMenu, setFilterMenu] = React.useState<
        CateringMenuDocumentPopulate[] | null
    >();

    const menuItems = useSelector((state: RootState) => state.cateringItem);
    const dispatch = useDispatch();

    const { data: menu, isPending } = useCateringMenu();

    function onSuccess() {
        toast.success("Item added successfully.");
        dispatch(clearState());
        setOpen(false);
        revalidateOrder(`/dashboard/orders/catering-${orderId}`);
    }

    console.log(menu);
    console.log(existingItems);

    const mutation = useAddItems(onSuccess);

    React.useEffect(() => {
        setFilterMenu(
            menu?.filter((item) => !existingItems.includes(item._id))
        );
    }, [menu, existingItems]);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <HeroButton isIconOnly variant="flat" radius="full" size="sm">
                    <Plus size={15} />
                </HeroButton>
            </DrawerTrigger>
            <DrawerContent className="max-w-5xl mx-auto">
                <div className="mx-auto w-full">
                    <DrawerHeader>
                        <DrawerTitle>Select Items</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 pb-0 max-h-[90%] overflow-y-scroll scrollbar-thin">
                        <div className="grid grid-cols-3 gap-3">
                            {isPending ? (
                                <div className="flex justify-center items-center gap-3 col-span-3 py-20">
                                    <Loader2 className="animate-spin" />{" "}
                                    Fetching menu...
                                </div>
                            ) : filterMenu && filterMenu.length > 0 ? (
                                // filterMenu.map((item) => (
                                //     <ItemCard key={item._id} menu={item} />
                                // ))
                                <></>
                            ) : (
                                <div className="text-center py-10 col-span-3">
                                    No items found.
                                </div>
                            )}
                        </div>
                    </div>
                    <DrawerFooter className="flex-row justify-end">
                        <Button
                            onClick={() =>
                                mutation.mutate({
                                    orderId,
                                    menuItems: menuItems,
                                })
                            }
                            disabled={mutation.isPending}
                        >
                            Add Item
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
