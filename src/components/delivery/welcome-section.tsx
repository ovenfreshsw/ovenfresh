"use client";

import { Card, CardContent } from "../ui/card";
import DeliveryStatSkeleton from "@/components/skeleton/delivery-stat-skeleton";
import { useDeliveryOrders } from "@/api-hooks/delivery/get-delivery-order";

const WelcomeSection = ({
    orderType,
}: {
    orderType: "tiffin" | "catering";
}) => {
    const { data: orders, isPending } = useDeliveryOrders(orderType);
    if (isPending) return <DeliveryStatSkeleton />;

    return (
        <section className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold mb-4">
                    Hello, Ready for Today&apos;s Deliveries?
                </h2>

                <div className="grid grid-cols-3 gap-3 mb-2">
                    <Card className="bg-primary-foreground text-primary">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">
                                {orders?.result?.total}
                            </p>
                            <p className="text-xs">Total Orders</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary-foreground text-primary">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">
                                {orders?.result?.pending}
                            </p>
                            <p className="text-xs">Pending</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary-foreground text-primary">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">
                                {orders?.result?.completed}
                            </p>
                            <p className="text-xs">Completed</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default WelcomeSection;
