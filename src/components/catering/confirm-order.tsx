import { format } from "date-fns";
import { MapPin, Phone } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CateringDocumentPopulate } from "@/models/types/catering";
import Image from "next/image";

// This would be replaced with your actual logo URL
const COMPANY_LOGO = "/logo.webp";

export default function OrderConfirmation({
    order,
}: {
    order: CateringDocumentPopulate;
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead className="text-right">
                                    Quantity
                                </TableHead>
                                <TableHead className="text-right">
                                    Price
                                </TableHead>
                                <TableHead className="text-right">
                                    Total
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="pr-10">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={
                                                    item.itemId.image ||
                                                    "/placeholder.svg"
                                                }
                                                alt={item.itemId.name}
                                                width={40}
                                                height={40}
                                                className="rounded-md"
                                            />
                                            <span className="whitespace-nowrap">
                                                {item.itemId.name}{" "}
                                                {item.itemId.variant
                                                    ? `(${item.itemId.variant})`
                                                    : ""}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] capitalize">
                                        {item.size}{" "}
                                        {item.itemId[
                                            `${item.size}ServingSize` as "smallServingSize"
                                        ]
                                            ? `(${
                                                  item.itemId[
                                                      `${item.size}ServingSize` as "smallServingSize"
                                                  ]
                                              })`
                                            : ""}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {item.quantity}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ${item.priceAtOrder.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        $
                                        {(
                                            item.quantity * item.priceAtOrder
                                        ).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
                            <span className="font-semibold">
                                Delivery Date:
                            </span>{" "}
                            {format(
                                new Date(order.deliveryDate),
                                "MMMM d, yyyy"
                            )}
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
