import Address from "@/models/addressModel";
import CateringMenu from "@/models/cateringMenuModel";
import Catering from "@/models/cateringModel";
import SortedOrders from "@/models/sortedOrdersModel";
import Tiffin from "@/models/tiffinModel";
import TiffinOrderStatus from "@/models/tiffinOrderStatusModel";
import { CateringDocumentPopulate } from "@/models/types/catering";
import { TiffinDocumentPopulate } from "@/models/types/tiffin";
import {
    TiffinOrderStatusDocument,
    TiffinOrderStatusDocumentPopulate,
} from "@/models/types/tiffin-order-status";
import { format } from "date-fns";

async function getSortedTiffinOrderDetails(storeId: string, zone: number) {
    const tiffins = await SortedOrders.findOne({
        store: storeId,
        date: format(new Date(), "yyyy-MM-dd"),
    }).populate({
        path: `${zone}.tiffin.order`,
        model: TiffinOrderStatus,
        populate: {
            path: "orderId",
            model: Tiffin,
            select: "customerName customerPhone orderId fullyPaid _id pendingBalance totalAmount advancePaid",
            populate: {
                path: "address",
                model: Address,
                select: "lat lng address",
            },
        },
    });

    const orders = tiffins[zone].tiffin;

    const formattedOrders = orders.map(
        (order: { order: TiffinOrderStatusDocumentPopulate }) => ({
            _id: order.order._id.toString(),
            orderId: order.order.orderId.orderId,
            customerName: order.order.orderId.customerName,
            customerPhone: order.order.orderId.customerPhone,
            status: order.order.status,
            fullyPaid: order.order.orderId.fullyPaid,
            pendingBalance: order.order.orderId.pendingBalance,
            totalPrice: order.order.orderId.totalPrice,
            advancePaid: order.order.orderId.advancePaid,
            address: {
                address: order.order.orderId.address.address,
                lat: order.order.orderId.address.lat,
                lng: order.order.orderId.address.lng,
            },
        })
    );

    return formattedOrders;
}

async function getSortedCateringOrderDetails(storeId: string, zone: number) {
    const caterings = await SortedOrders.findOne({
        store: storeId,
        date: format(new Date(), "yyyy-MM-dd"),
    }).populate({
        path: `${zone}.catering.order`,
        model: Catering,
        populate: [
            {
                path: "address",
                model: Address,
                select: "lat lng address",
            },
            {
                path: "items.itemId",
                model: CateringMenu,
                select: "name",
            },
        ],
        select: "orderId customerName customerPhone status fullyPaid _id pendingBalance totalPrice advancePaid deliveryDate items.quantity",
    });

    const orders = caterings[zone].catering;
    const formattedOrders = orders.map(
        (order: { order: CateringDocumentPopulate }) => ({
            _id: order.order._id.toString(),
            orderId: order.order.orderId,
            customerName: order.order.customerName,
            customerPhone: order.order.customerPhone,
            status: order.order.status,
            fullyPaid: order.order.fullyPaid,
            pendingBalance: order.order.pendingBalance,
            totalPrice: order.order.totalPrice,
            advancePaid: order.order.advancePaid,
            address: {
                address: order.order.address.address,
                lat: order.order.address.lat,
                lng: order.order.address.lng,
            },
            date: order.order.deliveryDate,
            items: order.order.items.map((item) => ({
                name: item.itemId.name,
                quantity: item.quantity,
            })),
        })
    );

    return formattedOrders;
}

export { getSortedTiffinOrderDetails, getSortedCateringOrderDetails };
