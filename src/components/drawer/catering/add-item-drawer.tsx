"use client";

import * as React from "react";
import { Loader2, Plus, Search, X } from "lucide-react";

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
import MenuItemCard from "@/components/catering/select-items/menu-item-card";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@heroui/input";
import { Show } from "@/components/show";

export function AddItemDrawer({
    orderId,
    existingItems,
}: {
    orderId: string;
    existingItems: string[];
}) {
    const [search, setSearch] = React.useState("");
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

    const mutation = useAddItems(onSuccess);

    React.useEffect(() => {
        setFilterMenu(
            menu?.filter((item) => !existingItems.includes(item._id))
        );
    }, [menu, existingItems]);

    React.useEffect(() => {
        if (search.length > 0) {
            setFilterMenu(
                menu?.filter(
                    (item) =>
                        item.name
                            .toLowerCase()
                            .includes(search.toLowerCase()) &&
                        !existingItems.includes(item._id)
                )
            );
        } else {
            setFilterMenu(
                menu?.filter((item) => !existingItems.includes(item._id))
            );
        }
    }, [menu, search]);

    function handelClose(value: boolean) {
        dispatch(clearState());
        setOpen(value);
    }

    return (
        <Drawer open={open} onOpenChange={handelClose}>
            <DrawerTrigger asChild>
                <HeroButton isIconOnly variant="flat" radius="full" size="sm">
                    <Plus size={15} />
                </HeroButton>
            </DrawerTrigger>
            <DrawerContent className="max-w-5xl mx-auto h-[90%]">
                <div className="mx-auto w-full flex flex-col h-full">
                    <DrawerHeader className="flex justify-between items-center">
                        <DrawerTitle>Select Items</DrawerTitle>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                            >
                                <X size={15} />
                            </Button>
                        </DialogClose>
                    </DrawerHeader>
                    <div className="px-4 pb-0 overflow-y-scroll scrollbar-thin flex-1">
                        <Show>
                            <Show.When isTrue={!isPending}>
                                <div className="mb-3">
                                    <Input
                                        placeholder="Search items..."
                                        className="max-w-sm"
                                        startContent={<Search size={15} />}
                                        value={search}
                                        onValueChange={setSearch}
                                    />
                                </div>
                            </Show.When>
                        </Show>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {isPending ? (
                                <div className="flex justify-center items-center gap-3 col-span-3 py-20">
                                    <Loader2 className="animate-spin" />{" "}
                                    Fetching menu...
                                </div>
                            ) : filterMenu && filterMenu.length > 0 ? (
                                filterMenu.map((item, i) => (
                                    <MenuItemCard item={item} key={i} />
                                ))
                            ) : (
                                <div className="text-center py-10 col-span-3">
                                    No items found.
                                </div>
                            )}
                        </div>
                    </div>
                    <DrawerFooter className="flex-row justify-end pb-7">
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
