import { Show } from "@/components/show";
import { Button } from "@/components/ui/button";
import { CateringItemsState } from "@/lib/types/catering/catering-order-state";
import { removeItem } from "@/store/slices/cateringItemSlice";
import { setAdvancePaid } from "@/store/slices/cateringOrderSlice";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useDispatch } from "react-redux";

const FinalItemCard = ({ item }: { item: CateringItemsState }) => {
    const dispatch = useDispatch();

    function handleRemoveItem(itemId: string, size: string) {
        dispatch(removeItem({ _id: itemId, size }));
        dispatch(setAdvancePaid(0));
    }

    return (
        <div className="flex space-x-4 mb-2 rounded-md border shadow p-3">
            <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={70}
                height={70}
                className="rounded-md shadow"
            />
            <div className="flex-1">
                <h3 className="font-medium flex items-center gap-1">
                    {item.name}{" "}
                    <Show>
                        <Show.When isTrue={item.variant !== undefined}>
                            <span className="text-muted-foreground text-xs font-normal">
                                &#040;{item.variant}&#041;
                            </span>
                        </Show.When>
                    </Show>
                </h3>
                <p className="text-xs text-gray-500 capitalize">
                    Size: {item.size}
                </p>
                <p className="text-xs text-gray-500">
                    Quantity: {item.quantity}
                </p>
            </div>
            <div className="flex flex-col justify-between items-end">
                <p className="font-medium">${item.priceAtOrder.toFixed(2)}</p>
                <Button
                    className="text-red-500 hover:bg-red-200 bg-transparent"
                    size={"icon"}
                    onClick={() => handleRemoveItem(item._id, item.size)}
                >
                    <Trash2 size={17} />
                </Button>
            </div>
        </div>
    );
};

export default FinalItemCard;
