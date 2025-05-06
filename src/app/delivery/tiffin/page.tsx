import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WelcomeSection from "@/components/delivery/welcome-section";
import { Suspense } from "react";
import DeliveryStatSkeleton from "@/components/skeleton/delivery-stat-skeleton";
import SortedOrderList from "@/components/delivery/sorted-order-list";
import ServerWrapper from "@/components/server-wrapper";
import { getDeliveryOrdersServer } from "@/lib/api/delivery/get-delivery-orders-server";

export default function DeliveryDashboard() {
    return (
        <>
            {/* Welcome Section */}
            <Suspense fallback={<DeliveryStatSkeleton />}>
                <ServerWrapper
                    queryFn={() => getDeliveryOrdersServer("tiffins")}
                    queryKey={["order", "delivery", "tiffins"]}
                >
                    <WelcomeSection orderType="tiffins" />
                </ServerWrapper>
            </Suspense>

            <main className="flex-1 container mx-auto px-3 py-4">
                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="active">Active Orders</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>

                    <Suspense
                        fallback={
                            <div className="flex justify-center items-center h-32 flex-col">
                                <Loader2 className="animate-spin" />
                                <span>Loading...</span>
                            </div>
                        }
                    >
                        <ServerWrapper
                            queryFn={() => getDeliveryOrdersServer("tiffins")}
                            queryKey={["order", "delivery", "tiffins"]}
                        >
                            <TabsContent
                                value="active"
                                className="space-y-4 pb-20"
                            >
                                <SortedOrderList
                                    status="PENDING"
                                    orderType="tiffins"
                                />
                            </TabsContent>
                            <TabsContent
                                value="completed"
                                className="space-y-4 pb-20"
                            >
                                <SortedOrderList
                                    status="DELIVERED"
                                    orderType="tiffins"
                                />
                            </TabsContent>
                        </ServerWrapper>
                    </Suspense>
                </Tabs>
            </main>
        </>
    );
}
