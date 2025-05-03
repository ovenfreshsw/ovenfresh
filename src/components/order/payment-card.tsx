import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import EditPaymentDialog from "../dialog/edit-payment-dialog";

const PaymentCard = ({
    orderId,
    totalPrice,
    tax,
    deliveryCharge,
    paymentMethod,
    advancePaid,
    pendingBalance,
    discount,
    fullyPaid,
    orderType,
}: {
    orderId: string;
    totalPrice: number;
    tax: number;
    deliveryCharge: number;
    paymentMethod: string;
    advancePaid: number;
    pendingBalance: number;
    discount: number;
    fullyPaid: boolean;
    orderType: "catering" | "tiffin";
}) => {
    return (
        <Card>
            <CardHeader className="flex justify-between flex-row items-center">
                <CardTitle>Payment Details</CardTitle>
                <EditPaymentDialog
                    orderId={orderId}
                    orderType={orderType}
                    paymentDetails={{
                        subtotal: totalPrice - tax - (deliveryCharge || 0),
                        tax,
                        deliveryCharge,
                        paymentMethod,
                        advancePaid,
                        pendingBalance,
                        discount,
                        fullyPaid: fullyPaid,
                    }}
                />
            </CardHeader>
            <CardContent>
                <div
                    className={
                        orderType === "catering" ? "space-y-3" : "space-y-4"
                    }
                >
                    <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>
                            $
                            {(totalPrice - tax - (deliveryCharge || 0)).toFixed(
                                2
                            )}
                        </span>
                    </div>
                    {orderType === "catering" && (
                        <div className="flex justify-between text-sm">
                            <span>Delivery fee</span>
                            <span>${deliveryCharge?.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Payment Method</span>
                            <span className="capitalize">{paymentMethod}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Advance Paid</span>
                            <span>${advancePaid.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Discount</span>
                            <span>${discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Pending Balance</span>
                            <span>${pendingBalance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Payment Status</span>
                            <Badge
                                variant={fullyPaid ? "default" : "secondary"}
                            >
                                {fullyPaid ? "Paid" : "Partially Paid"}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PaymentCard;
