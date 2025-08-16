import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeliveryProof } from "@/lib/types/delivery";
import { format } from "date-fns";
import {
    Check,
    Copy,
    ImageUpscale,
    SquareArrowOutUpRight,
    Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DeleteDialog from "../dialog/delete-dialog";
import { deleteProofAction } from "@/actions/delete-proof-action";
import { Status, StatusIndicator, StatusLabel } from "../ui/kibo-ui/status";

const statusColors: Record<
    string,
    "online" | "offline" | "degraded" | "maintenance"
> = {
    sent: "online",
    failed: "offline",
    stopped: "degraded",
};

const ProofCard = ({ order }: { order: DeliveryProof }) => {
    const [imageSrc, setImageSrc] = useState<string | undefined>(order.image);
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        navigator.clipboard.writeText(order.image);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-3">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-base">
                            {order.orderId}
                        </CardTitle>
                        <CardDescription>
                            <span className="text-primary capitalize text-sm">
                                {order.store}
                            </span>
                        </CardDescription>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="outline" asChild>
                                    <Link
                                        href={`/dashboard/orders/tiffin-${order.orderId}?mid=${order.order_id}`}
                                    >
                                        <SquareArrowOutUpRight className="size-4" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>View order details</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <div className="relative aspect-video bg-muted">
                <Image
                    src={imageSrc || "/"}
                    alt="Primary proof image"
                    onError={() => setImageSrc("/fsr-placeholder.webp")}
                    fill
                    className="object-cover aspect-[3/2]"
                />
                <div className="flex items-center gap-1 absolute top-0 right-0 z-10 m-1">
                    <DeleteDialog
                        action={deleteProofAction}
                        errorMsg="Failed to delete proof"
                        id={order._id}
                        loadingMsg="Deleting proof..."
                        successMsg="Proof deleted successfully!"
                        title="proof"
                    >
                        <button className="bg-white/90 p-1 rounded-md">
                            <Trash2 className="size-4 text-red-500" />
                        </button>
                    </DeleteDialog>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button className="bg-white/90 p-1 rounded-md">
                                    <Link href={order.image} target="_blank">
                                        <ImageUpscale className="size-4" />
                                    </Link>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>View in a new tab</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    className="bg-white/90 p-1 rounded-md"
                                    onClick={handleCopy}
                                >
                                    {copied ? (
                                        <Check className="size-4" />
                                    ) : (
                                        <Copy className="size-4" />
                                    )}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Copy URL</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <CardContent className="p-3">
                <div className="text-xs flex gap-1 items-center">
                    <p className="text-muted-foreground">Delivered:</p>
                    <p>{format(new Date(order.deliveryDate), "PPP")}</p>
                </div>
                <div className="text-xs flex gap-1 items-center">
                    <p className="text-muted-foreground">Delivered by:</p>
                    <p className="capitalize">{order.user}</p>
                </div>
                <div className="text-xs flex gap-1 items-center">
                    <p className="text-muted-foreground">Message Status:</p>
                    <Status status={statusColors[order.messageStatus]}>
                        <StatusIndicator />
                        <StatusLabel className="capitalize">
                            {order.messageStatus}
                        </StatusLabel>
                    </Status>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProofCard;
