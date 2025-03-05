import { Skeleton } from "../ui/skeleton";

const StatCardSKeleton = () => {
    return (
        <div className="size-full rounded-md border p-4 space-y-3 bg-primary-foreground">
            <Skeleton className="w-1/2 h-4 rounded-md" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-10 rounded-md" />
                <Skeleton className="w-14 h-6 rounded-md" />
            </div>
            <Skeleton className="w-2/3 h-4 rounded-md" />
            <Skeleton className="w-1/2 h-4 rounded-md" />
        </div>
    );
};

export default StatCardSKeleton;
