import { SquareArrowOutUpRight } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@heroui/theme";

const OrderCard = ({
    mid,
    orderId,
    address,
    status,
    orderType,
}: {
    mid: string;
    orderId: string;
    address: string;
    status: string;
    orderType: "tiffin" | "catering";
}) => {
    return (
        <div className="rounded-md border shadow-sm w-full p-3 flex justify-between items-center">
            <div>
                <h2 className="text-sm font-medium">
                    Order ID: {orderId} <CustomChip>{status}</CustomChip>
                </h2>
                <p className="text-xs">Address: {address}</p>
            </div>
            <div className="flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href={`/dashboard/orders/${orderType}-${orderId}?mid=${mid}`}
                                target="_blank"
                            >
                                <button className="bg-white size-8 flex justify-center items-center rounded-md shadow border">
                                    <SquareArrowOutUpRight size={20} />
                                </button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>View order details</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {/* <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="bg-white size-8 flex justify-center items-center rounded-md shadow border">
                                <ArrowRight size={20} />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Move to zone 2</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider> */}
            </div>
        </div>
    );
};

export default OrderCard;

function CustomChip({ children }: { children: ReactNode }) {
    const colorMap: Record<string, string> = {
        DELIVERED: "bg-success",
        ONGOING: "bg-warning",
        PENDING: "bg-primary",
    };
    return (
        <span
            className={cn(
                "text-primary-foreground text-xs rounded-md px-2 py-0.5",
                colorMap[children as string]
            )}
        >
            {children}
        </span>
    );
}
