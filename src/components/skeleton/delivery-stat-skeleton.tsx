import { Skeleton } from "../ui/skeleton";

const DeliveryStatSkeleton = () => {
    return (
        <section className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold mb-4 flex">
                    Hello, Ready for Today's Deliveries?
                </h2>

                <div className="grid grid-cols-3 gap-4 mb-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            className="bg-primary-foreground rounded-xl border shadow p-4 flex flex-col justify-center items-center gap-2"
                            key={i}
                        >
                            <Skeleton className="size-6 rounded-md bg-primary/30" />
                            <Skeleton className="w-20 h-4 rounded-md bg-primary/30" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DeliveryStatSkeleton;
