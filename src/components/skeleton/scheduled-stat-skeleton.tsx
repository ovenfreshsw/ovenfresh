import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const ScheduledStatSkeleton = () => {
    return (
        <Card className="w-full h-full bg-primary-foreground shadow-sm rounded-lg flex flex-col">
            <CardHeader className="p-4 pt-2 flex-row items-center justify-between">
                <Skeleton className="w-1/2 h-6 rounded-md" />
                <Skeleton className="w-16 h-8 rounded-md" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="size-16 rounded-full flex-shrink-0" />
                    <div className="w-full space-y-2">
                        <Skeleton className="w-[90%] h-4 rounded-md" />
                        <Skeleton className="w-[75%] h-4 rounded-md" />
                        <Skeleton className="w-[75%] h-4 rounded-md" />
                        <Skeleton className="w-[75%] h-4 rounded-md" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="size-16 rounded-full flex-shrink-0" />
                    <div className="w-full space-y-2">
                        <Skeleton className="w-[90%] h-4 rounded-md" />
                        <Skeleton className="w-[75%] h-4 rounded-md" />
                        <Skeleton className="w-[75%] h-4 rounded-md" />
                        <Skeleton className="w-[75%] h-4 rounded-md" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ScheduledStatSkeleton;
