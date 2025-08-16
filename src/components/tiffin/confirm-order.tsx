import { format } from "date-fns";
import { MapPin, Phone } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TiffinDocumentPopulate } from "@/models/types/tiffin";
import Image from "next/image";

// This would be replaced with your actual logo URL
const COMPANY_LOGO = "/logo.webp";

export default function OrderConfirmation({
    order,
}: {
    order: TiffinDocumentPopulate;
}) {
    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="flex justify-center flex-col md:flex-row md:justify-between items-center mb-8">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <Image
                        src={COMPANY_LOGO || "/placeholder.svg"}
                        alt="Company Logo"
                        width={64}
                        height={64}
                        className="rounded-full"
                    />
                    <h1 className="text-2xl font-bold">The Oven Fresh</h1>
                </div>
                <div className="text-center md:text-right">
                    <p className="font-semibold">Order ID: {order.orderId}</p>
                    <p className="text-sm text-muted-foreground">
                        Store: {order.store.name}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold">{order.customerName}</p>
                        <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {order.customerPhone}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Delivery Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-1" />
                            {order.address.address}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Lat: {order.address.lat}, Lng: {order.address.lng}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 text-sm">
                            Order Type:{" "}
                            <span className="capitalize font-semibold">
                                {order.order_type}
                            </span>
                        </div>
                        <div>
                            Number of weeks:{" "}
                            <span className="capitalize font-semibold">
                                {order.numberOfWeeks}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between py-1">
                            <span>Subtotal:</span>
                            <span>
                                ${(order.totalPrice - order.tax).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span>Tax:</span>
                            <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-1 font-semibold">
                            <span>Total:</span>
                            <span>${order.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-1 text-green-600">
                            <span>Advance Paid:</span>
                            <span>${order.advancePaid.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-1 text-red-600 font-semibold">
                            <span>Pending Balance:</span>
                            <span>${order.pendingBalance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-1 mt-2">
                            <span>Payment Method:</span>
                            <span className="capitalize">
                                {order.paymentMethod}
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            <span className="font-semibold">Start Date:</span>{" "}
                            {format(new Date(order.startDate), "MMMM d, yyyy")}
                        </p>
                        <p>
                            <span className="font-semibold">End Date:</span>{" "}
                            {format(new Date(order.endDate), "MMMM d, yyyy")}
                        </p>
                        <p className="mt-4">
                            <span className="font-semibold">Note:</span>
                        </p>
                        <p className="mt-1 text-muted-foreground">
                            {order.note}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center text-sm text-muted-foreground">
                <p>Thank you for your order!</p>
                <p>{order.store.name}</p>
                <p>{order.store.phone}</p>
                <p>{order.store.address}</p>
            </div>
        </div>
    );
}
