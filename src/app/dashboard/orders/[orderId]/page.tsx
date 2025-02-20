import CateringOrderDetails from "@/components/catering/order-details";
import TiffinOrderDetails from "@/components/tiffin/order-details";
import { getOrderServer } from "@/lib/api/order/get-order";
import { CateringDocumentPopulate } from "@/models/types/catering";
import { TiffinDocumentPopulate } from "@/models/types/tiffin";
import { notFound } from "next/navigation";

const OrderPage = async ({
    params,
}: {
    params: Promise<{ orderId: string }>;
}) => {
    const { orderId: orderKey } = await params;
    const orderType = orderKey.split("-")[0];
    const orderId = orderKey.split("-")[1];

    if (orderType !== "catering" && orderType !== "tiffin") {
        return notFound();
    }

    const order = await getOrderServer(orderId, orderType).catch(() =>
        notFound()
    );

    if (!order) notFound();

    return (
        <div className="container mx-auto py-10">
            {orderType === "catering" ? (
                <CateringOrderDetails
                    orderData={order as CateringDocumentPopulate}
                />
            ) : (
                <TiffinOrderDetails
                    orderData={order as TiffinDocumentPopulate}
                />
            )}
        </div>
    );
};

export default OrderPage;
