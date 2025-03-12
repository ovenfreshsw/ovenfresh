"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { RadioGroup, Radio } from "@heroui/radio";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
    decrementQuantity,
    incrementQuantity,
} from "@/store/slices/cateringItemSlice";

type Size = "small" | "medium" | "large";
type MenuItemCardProps = {
    item: {
        _id: string;
        name: string;
        category: string;
        variant?: string;
        smallPrice?: number;
        mediumPrice?: number;
        largePrice?: number;
        smallServingSize?: string;
        mediumServingSize?: string;
        largeServingSize?: string;
        image?: string;
    };
};

const MenuItemCard = ({ item }: MenuItemCardProps) => {
    const [imgSrc, setImgSrc] = useState(item.image);
    const [size, setSize] = useState<Size>("small");
    const cateringOrder = useSelector((state: RootState) => state.cateringItem);
    const dispatch = useDispatch();

    const handleIncrement = () => {
        dispatch(
            incrementQuantity({
                _id: item._id,
                name: item.name,
                category: item.category,
                variant: item.variant,
                image: item.image || "/fsr-placeholder.webp",
                size: size,
                priceAtOrder: item[`${size}Price`] || 0,
                quantity: 1,
            })
        );
    };

    const handleDecrement = () => {
        dispatch(
            decrementQuantity({
                _id: item._id,
                name: item.name,
                category: item.category,
                variant: item.variant,
                image: item.image || "/fsr-placeholder.webp",
                size: size,
                priceAtOrder: item[`${size}Price`] || 0,
                quantity: 1,
            })
        );
    };

    const quantity =
        cateringOrder.find(
            (orderItem) => orderItem._id === item._id && orderItem.size === size
        )?.quantity || 0;

    return (
        <Card key={item._id}>
            <div className="flex items-center p-3 border-b">
                <div className="w-16 h-16 relative overflow-hidden rounded-md mr-3 flex-shrink-0">
                    <Image
                        src={imgSrc || "/"}
                        onError={() => setImgSrc("/fsr-placeholder.webp")}
                        alt={item.name}
                        fill
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="font-medium">{item.name}</h3>
                    {item.variant && (
                        <Badge variant="outline" className="mt-1">
                            {item.variant}
                        </Badge>
                    )}
                </div>
            </div>
            <CardContent className="p-3">
                <div className="grid grid-cols-1 gap-1 text-sm">
                    <RadioGroup
                        label="Select size"
                        size="sm"
                        value={size}
                        onValueChange={(value) => setSize(value as Size)}
                    >
                        {item.smallPrice && (
                            <div className="flex justify-between">
                                <Radio value="small">
                                    Small ({item.smallServingSize || "5 PPL"})
                                </Radio>
                                <span>$ {item.smallPrice}</span>
                            </div>
                        )}
                        {item.mediumPrice && (
                            <div className="flex justify-between">
                                <Radio value="medium">
                                    Medium ({item.mediumServingSize || "10 PPL"}
                                    )
                                </Radio>
                                <span>$ {item.mediumPrice}</span>
                            </div>
                        )}
                        {item.largePrice && (
                            <div className="flex justify-between">
                                <Radio value="large">
                                    Full Deep (
                                    {item.largeServingSize || "15 PPL"})
                                </Radio>
                                <span>$ {item.largePrice}</span>
                            </div>
                        )}
                    </RadioGroup>
                </div>
            </CardContent>
            <CardFooter className="p-3 pt-0">
                <div className="flex items-center ms-auto bg-gray-200 p-0.5 rounded-full">
                    <Button
                        size={"icon"}
                        className="rounded-full size-9 flex justify-center items-center bg-white shadow-sm text-black hover:bg-white/50"
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
                        className="rounded-full size-9 flex justify-center items-center bg-primary shadow-sm"
                        onClick={handleIncrement}
                        type="button"
                    >
                        <Plus size={15} />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default MenuItemCard;
