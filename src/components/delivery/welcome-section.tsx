"use client";

import { useState } from "react";
import { Card, CardContent } from "../ui/card";

const WelcomeSection = () => {
    const [activeOrders, setActiveOrders] = useState([
        {
            id: "ORD-1234",
            customer: "John Smith",
            address: "123 Main St, Apt 4B, New York, NY 10001",
            date: "Today, 2:00 PM",
            status: "Paid",
            phone: "+1 (555) 123-4567",
        },
        {
            id: "ORD-5678",
            customer: "Sarah Johnson",
            address: "456 Park Ave, Brooklyn, NY 11201",
            date: "Today, 3:30 PM",
            status: "Cash on Delivery",
            phone: "+1 (555) 987-6543",
        },
        {
            id: "ORD-9012",
            customer: "Michael Brown",
            address: "789 Broadway, Queens, NY 11106",
            date: "Today, 5:00 PM",
            status: "Paid",
            phone: "+1 (555) 456-7890",
        },
    ]);

    const [completedOrders, setCompletedOrders] = useState([
        {
            id: "ORD-3456",
            customer: "Emily Davis",
            address: "321 Oak St, Bronx, NY 10452",
            date: "Today, 11:30 AM",
            status: "Paid",
            phone: "+1 (555) 234-5678",
        },
        {
            id: "ORD-7890",
            customer: "David Wilson",
            address: "654 Pine St, Staten Island, NY 10301",
            date: "Today, 10:15 AM",
            status: "Cash on Delivery",
            phone: "+1 (555) 876-5432",
        },
    ]);
    return (
        <section className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold mb-4">
                    Hello Alex, Ready for Today's Deliveries?
                </h2>

                <div className="grid grid-cols-3 gap-4 mb-2">
                    <Card className="bg-primary-foreground text-primary">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">
                                {activeOrders.length + completedOrders.length}
                            </p>
                            <p className="text-xs">Total Orders</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary-foreground text-primary">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">
                                {activeOrders.length}
                            </p>
                            <p className="text-xs">Pending</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary-foreground text-primary">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">
                                {completedOrders.length}
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
