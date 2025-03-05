import { Button } from "@/components/ui/button";
import { CateringMenuDocument } from "@/models/types/catering-menu";
import { RootState } from "@/store";
import {
    decrementQuantity,
    incrementQuantity,
} from "@/store/slices/cateringItemSlice";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function ItemCard({ menu }: { menu: CateringMenuDocument }) {
    const cateringOrder = useSelector((state: RootState) => state.cateringItem);
    const dispatch = useDispatch();

    const handleIncrement = () => {
        dispatch(
            incrementQuantity({
                _id: menu._id,
                name: menu.name,
                image:
                    menu.image ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScO99JkPvdfSyT3CbMrYsKBpRuXOACVR2cP9F6DBcP9B6nQ9oszX_18T-2oNv6Gyxwyhk",
                priceAtOrder: menu.price,
                quantity: 1,
            })
        );
    };

    const handleDecrement = () => {
        dispatch(
            decrementQuantity({
                _id: menu._id,
                name: menu.name,
                image:
                    menu.image ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScO99JkPvdfSyT3CbMrYsKBpRuXOACVR2cP9F6DBcP9B6nQ9oszX_18T-2oNv6Gyxwyhk",
                priceAtOrder: menu.price,
                quantity: 1,
            })
        );
    };

    const quantity =
        cateringOrder.find((item) => item._id === menu._id)?.quantity || 0;

    return (
        <div className="rounded-md bg-white p-4 h-fit shadow border space-y-3">
            <div className="flex items-start gap-4">
                <Image
                    src={
                        menu.image ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScO99JkPvdfSyT3CbMrYsKBpRuXOACVR2cP9F6DBcP9B6nQ9oszX_18T-2oNv6Gyxwyhk"
                    }
                    alt={menu.name}
                    className="rounded size-20"
                    width={80}
                    height={80}
                ></Image>
                <div>
                    <span className="font-medium">{menu.name}</span>
                    <p className="text-xs text-muted-foreground">
                        {menu.description}
                    </p>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="text-xl font-medium">${menu.price}</div>
                <div className="flex items-center bg-gray-200 p-0.5 rounded-full">
                    <Button
                        size={"icon"}
                        className="rounded-full size-7 flex justify-center items-center bg-white shadow-sm text-black"
                        onClick={handleDecrement}
                        disabled={quantity === 0}
                        type="button"
                    >
                        <Minus size={15} />
                    </Button>
                    <div className="w-6 text-center select-none">
                        {quantity}
                    </div>
                    <Button
                        size={"icon"}
                        className="rounded-full size-7 flex justify-center items-center bg-primary shadow-sm"
                        onClick={handleIncrement}
                        type="button"
                    >
                        <Plus size={15} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ItemCard;
