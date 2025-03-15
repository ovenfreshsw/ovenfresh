import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const CardSkeleton = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "flex justify-center items-center gap-1 min-h-[420px] bg-white rounded-lg shadow",
                className
            )}
        >
            <Loader2 className="animate-spin" />
            Loading...
        </div>
    );
};

export default CardSkeleton;
