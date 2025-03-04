// "use client";

// import { useState } from "react";
import {
    Phone,
    MapPin,
    CheckCircle,
    ChevronRight,
    Clock,
    CreditCard,
    DollarSign,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/delivery/navbar";
import WelcomeSection from "@/components/delivery/welcome-section";

export default function DeliveryDashboard() {
    // const markAsDelivered = (orderId: string) => {
    //     const orderToMove = activeOrders.find((order) => order.id === orderId);
    //     if (orderToMove) {
    //         setActiveOrders(
    //             activeOrders.filter((order) => order.id !== orderId)
    //         );
    //         setCompletedOrders([orderToMove, ...completedOrders]);
    //     }
    // };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 max-w-md mx-auto">
            {/* Header */}
            <Navbar />

            {/* Welcome Section */}
            <WelcomeSection />

            {/* Main Content */}
            {/* <main className="flex-1 container mx-auto px-4 py-4">
                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="active">Active Orders</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>

                    <TabsContent value="active" className="space-y-4">
                        {activeOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                    No active orders
                                </p>
                            </div>
                        ) : (
                            activeOrders.map((order) => (
                                <Card key={order.id} className="mb-4">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">
                                                {order.id}
                                            </CardTitle>
                                            <Badge
                                                variant={
                                                    order.status === "Paid"
                                                        ? "default"
                                                        : "outline"
                                                }
                                            >
                                                {order.status === "Paid" ? (
                                                    <>
                                                        <CreditCard className="h-3 w-3 mr-1" />{" "}
                                                        Paid
                                                    </>
                                                ) : (
                                                    <>
                                                        <DollarSign className="h-3 w-3 mr-1" />{" "}
                                                        Cash on Delivery
                                                    </>
                                                )}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-10 w-10 mt-1">
                                                <AvatarFallback>
                                                    {order.customer.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-medium">
                                                    {order.customer}
                                                </h3>
                                                <p className="text-sm text-muted-foreground flex items-start mt-1">
                                                    <MapPin className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                                                    <span>{order.address}</span>
                                                </p>
                                                <p className="text-sm text-muted-foreground flex items-center mt-1">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    <span>{order.date}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between pt-2">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center"
                                            >
                                                <MapPin className="h-4 w-4 mr-1" />
                                                Navigate
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center"
                                            >
                                                <Phone className="h-4 w-4 mr-1" />
                                                Call
                                            </Button>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                markAsDelivered(order.id)
                                            }
                                            size="sm"
                                            className="flex items-center"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Delivered
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-4">
                        {completedOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                    No completed orders
                                </p>
                            </div>
                        ) : (
                            completedOrders.map((order) => (
                                <Card key={order.id} className="mb-4">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">
                                                {order.id}
                                            </CardTitle>
                                            <Badge
                                                variant="default"
                                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                            >
                                                <CheckCircle className="h-3 w-3 mr-1" />{" "}
                                                Delivered
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-10 w-10 mt-1">
                                                <AvatarFallback>
                                                    {order.customer.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-medium">
                                                    {order.customer}
                                                </h3>
                                                <p className="text-sm text-muted-foreground flex items-start mt-1">
                                                    <MapPin className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                                                    <span>{order.address}</span>
                                                </p>
                                                <p className="text-sm text-muted-foreground flex items-center mt-1">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    <span>{order.date}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end pt-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex items-center text-muted-foreground"
                                        >
                                            Details
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </main> */}

            {/* Bottom Navigation */}
            {/* <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20">
                <div className="bg-background rounded-full shadow-lg flex items-center p-1 border border-border">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 px-6 py-2 rounded-full"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                        >
                            <path d="M15 11h.01"></path>
                            <path d="M11 15h.01"></path>
                            <path d="M16 16h.01"></path>
                            <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16Z"></path>
                            <path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4"></path>
                        </svg>
                        <span>Catering</span>
                    </Button>
                    <div className="w-px h-8 bg-border mx-1"></div>
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 px-6 py-2 rounded-full"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                        >
                            <path d="M8.21 13.89 7 23l9-9"></path>
                            <path d="m14 16 .93-1.86a1.93 1.93 0 0 0-.56-2.38l-.93-.93a1.93 1.93 0 0 1-.56-2.38L14 7"></path>
                            <path d="M8 6h0"></path>
                            <path d="M6 18h.01"></path>
                            <path d="m2 2 20 20"></path>
                            <path d="M4 4 2 6"></path>
                        </svg>
                        <span>Tiffin</span>
                    </Button>
                </div>
            </div> */}
        </div>
    );
}
