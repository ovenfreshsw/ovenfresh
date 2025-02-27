import OrdersPDFViewer from "./order-pdf-generator";
import connectDB from "@/lib/mongodb";
import { isValid, startOfDay } from "date-fns";
import {
    getScheduledCateringOrders,
    getScheduledTiffinOrders,
} from "@/lib/mongo-query/get-scheduled-orders";

const ScheduledPage = async ({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const date = (await searchParams)?.date as string;
    const store = (await searchParams)?.store as string;

    if (!store) {
        throw new Error("Store ID not provided!");
    }

    // Parse dates and check validity
    const validDate = isValid(new Date(date))
        ? new Date(date)
        : startOfDay(new Date());

    await connectDB();

    const catering = await getScheduledCateringOrders(validDate, store);
    const tiffin = await getScheduledTiffinOrders(validDate);

    return (
        <OrdersPDFViewer
            date={validDate}
            tiffinOrders={tiffin.map((order) => ({
                id: order.orderId.orderId,
                store: order.orderId.store.location,
                customer: order.orderId.customerName,
                phone: order.orderId.customerPhone,
                address: order.orderId.address.address,
                order_type: order.orderId.order_type,
            }))}
            cateringOrders={catering.map((order) => {
                return {
                    id: order.orderId,
                    store: order.store.location,
                    customer: order.customerName,
                    phone: order.customerPhone,
                    address: order.address.address,
                    items: order.items.map((item) => {
                        return {
                            name: item.itemId.name,
                            quantity: item.quantity,
                            priceAtOrder: item.priceAtOrder,
                        };
                    }),
                    order_type: order.order_type,
                };
            })}
        />
    );
};

export default ScheduledPage;
