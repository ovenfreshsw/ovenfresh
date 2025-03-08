import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WelcomeSection from "@/components/delivery/welcome-section";
import { Suspense } from "react";
import DeliveryStatSkeleton from "@/components/skeleton/delivery-stat-skeleton";
import ServerWrapper from "@/components/delivery/server-wrapper";
import SortedOrderList from "@/components/delivery/sorted-order-list";
import { getDeliveryOrdersServer } from "@/lib/api/order/get-delivery-orders";
import BottomNav from "@/components/delivery/bottom-nav";

export default function DeliveryDashboard() {
    return (
        <>
            {/* Welcome Section */}
            <Suspense fallback={<DeliveryStatSkeleton />}>
                <ServerWrapper
                    queryFn={() => getDeliveryOrdersServer("catering")}
                    queryKey={["delivery", "sortedOrders", "catering"]}
                >
                    <WelcomeSection orderType="catering" />
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
                            queryFn={() => getDeliveryOrdersServer("catering")}
                            queryKey={["delivery", "sortedOrders", "catering"]}
                        >
                            <TabsContent
                                value="active"
                                className="space-y-4 pb-20"
                            >
                                <SortedOrderList
                                    status="PENDING"
                                    orderType="catering"
                                />
                            </TabsContent>
                            <TabsContent
                                value="completed"
                                className="space-y-4 pb-20"
                            >
                                <SortedOrderList
                                    status="DELIVERED"
                                    orderType="catering"
                                />
                            </TabsContent>
                        </ServerWrapper>
                    </Suspense>
                </Tabs>
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </>
    );
}
