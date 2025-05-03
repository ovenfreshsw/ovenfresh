import { Button } from "@/components/ui/button";
import { CateringCustomItemState } from "@/lib/types/catering/catering-order-state";
import { removeCustomItem } from "@/store/slices/cateringCustomItemSlice";
import { setAdvancePaid } from "@/store/slices/cateringOrderSlice";
import { ImageIcon, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";

const FinalCustomItemCard = ({ item }: { item: CateringCustomItemState }) => {
    const dispatch = useDispatch();

    function handleRemoveItem(name: string) {
        dispatch(removeCustomItem({ name }));
        dispatch(setAdvancePaid(0));
    }

    return (
        <div className="flex space-x-4 mb-2 rounded-md border shadow p-3">
            <div className="size-[70px] flex justify-center items-center rounded-md shadow">
                <ImageIcon size={15} />
            </div>
            <div className="flex-1">
                <h3 className="font-medium flex items-center gap-1">
                    {item.name}{" "}
                </h3>
                <p className="text-xs text-gray-500 capitalize">
                    Size: {item.size}
                </p>
            </div>
            <div className="flex flex-col justify-between items-end">
                <p className="font-medium">${item.priceAtOrder.toFixed(2)}</p>
                <Button
                    className="text-red-500 hover:bg-red-200 bg-transparent"
                    size={"icon"}
                    onClick={() => handleRemoveItem(item.name)}
                >
                    <Trash2 size={17} />
                </Button>
            </div>
        </div>
    );
};

export default FinalCustomItemCard;
