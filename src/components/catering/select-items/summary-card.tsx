import ItemCardSummary from "./item-card-summary";
import { OrderListDrawer } from "@/components/drawer/catering/order-list-drawer";
import { PaymentDetailsDrawer } from "@/components/drawer/catering/payment-details-drawer";
import { RootState } from "@/store";
import { Info } from "lucide-react";
import { useSelector } from "react-redux";

function SummaryCard() {
    const cateringOrder = useSelector((state: RootState) => state.cateringItem);

    const total = cateringOrder.reduce(
        (acc, item) => acc + item.priceAtOrder * item.quantity,
        0
    );
    const tax = (total * Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0)) / 100;
    const totalPayment = total + tax;

    return (
        <div className="fixed lg:relative right-0 left-0 bottom-0 lg:p-0 p-4">
            <div className="w-full bg-white rounded-md shadow p-4 border">
                <h2 className="mb-4 hidden lg:block">Order Summary</h2>

                <div className="space-y-2 max-h-96 scrollbar-thin overflow-y-scroll">
                    <div className="flex justify-between items-center lg:hidden">
                        <span>{cateringOrder.length} items in the list</span>
                        <OrderListDrawer />
                    </div>
                    <div className="space-y-2 lg:block hidden">
                        {cateringOrder.length > 0 ? (
                            cateringOrder.map((item) => (
                                <ItemCardSummary item={item} key={item._id} />
                            ))
                        ) : (
                            <span className="text-xs text-muted-foreground flex items-center gap-1 justify-center mb-3">
                                <Info size={15} /> Select any item to view
                                summary
                            </span>
                        )}
                    </div>
                </div>
                <div className="lg:bg-gray-100 lg:rounded-md lg:p-2 mt-1 sm:mt-2 lg:mt-4">
                    <h2 className="mb-4 hidden lg:block">Payment Summary</h2>

                    <div className="flex justify-between items-center lg:hidden">
                        <span>
                            Total:{" "}
                            <b className="font-medium">
                                ${totalPayment.toFixed(2)}
                            </b>
                        </span>
                        <PaymentDetailsDrawer />
                    </div>

                    <div className="space-y-2 hidden lg:block">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                                Sub Total
                            </span>
                            <span className="font-medium">${total}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Tax</span>
                            <span className="font-medium">
                                ${tax.toFixed(2)}
                            </span>
                        </div>
                        <hr />
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                                Total Payment
                            </span>
                            <span className="font-medium">${totalPayment}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SummaryCard;
