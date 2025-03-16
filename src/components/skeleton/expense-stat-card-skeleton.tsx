import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const ExpenseStatCardSkeleton = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>
                    <Skeleton className="w-32 h-5" />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="w-1/2 h-10" />
                <Skeleton className="w-32 h-5" />
            </CardContent>
        </Card>
    );
};

export default ExpenseStatCardSkeleton;
