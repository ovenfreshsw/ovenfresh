import { CateringItemsState } from "@/lib/types/catering/catering-order-state";
import Image from "next/image";

function ItemCardSummary({ item }: { item: CateringItemsState }) {
    return (
        <div className="flex gap-2 px-3">
            <Image
                src={item.image}
                alt={item.name}
                width={56}
                height={56}
                className="rounded size-14"
            />
            <div className="flex flex-col flex-1">
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">
                    x{item.quantity}
                </span>
            </div>
            <div className="mt-auto font-medium">
                ${item.priceAtOrder * item.quantity}
            </div>
        </div>
    );
}

export default ItemCardSummary;
