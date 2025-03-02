import { Skeleton } from "../ui/skeleton";

const TableSkeleton = () => {
    return (
        <div className="w-full rounded-lg shadow-md border p-6">
            <div className="flex justify-between mb-3">
                <Skeleton className="w-1/4 h-7 rounded-md" />
                <Skeleton className="w-20 h-8 rounded-md shadow-md" />
            </div>
            <div className="space-y-3">
                <Skeleton className="w-full h-10 rounded-lg shadow-md" />
                <div className="grid grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="w-full h-5 rounded-md" />
                    ))}
                </div>
                <div className="grid grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="w-full h-5 rounded-md" />
                    ))}
                </div>
                <div className="grid grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="w-full h-5 rounded-md" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TableSkeleton;
