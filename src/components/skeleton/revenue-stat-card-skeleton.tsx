import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

const RevenueStatCardSkeleton = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>
                    <Skeleton className="w-32 h-5" />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="w-1/2 h-10" />
                <Separator />
                <div className="flex gap-2 items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <Skeleton className="w-14 h-4" />
                        <Skeleton className="w-16 h-4" />
                    </div>
                    <div className="h-10 w-px bg-muted-foreground/30"></div>
                    <div className="flex flex-col gap-1">
                        <Skeleton className="w-14 h-4" />
                        <Skeleton className="w-16 h-4" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RevenueStatCardSkeleton;
