import { authOptions } from "@/lib/auth";
import { error400, error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { clusterOrders, findOptimalRoute, isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Address from "@/models/addressModel";
import SortedOrders from "@/models/sortedOrdersModel";
import Tiffin from "@/models/tiffinModel";
import TiffinOrderStatus from "@/models/tiffinOrderStatusModel";
import User from "@/models/userModel";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import {
    getSortedCateringOrderDetails,
    getSortedTiffinOrderDetails,
} from "./helper";
import Catering from "@/models/cateringModel";
import mongoose from "mongoose";
import Store from "@/models/storeModel";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "DELIVERY", "MANAGER"]))
            return error403();
        const orderType = req.nextUrl.searchParams.get("orderType");
        if (!orderType) return error400("Invalid order type.");

        const result = {
            total: 0,
            pending: 0,
            completed: 0,
        };

        const session = await getServerSession(authOptions);
        const storeId = session?.user?.storeId;
        if (!storeId) return error403();

        const storeObjectId =
            mongoose.Types.ObjectId.createFromHexString(storeId);
        const today = format(new Date(), "yyyy-MM-dd");

        const [isZoneAssigned, store] = await Promise.all([
            User.findOne({
                _id: session.user.id,
                zone: { $exists: true },
            }),
            Store.findOne({ _id: storeObjectId }),
        ]);

        if (!isZoneAssigned)
            return success200({
                data: { orders: [], result, haveZone: false },
            });
        if (!store) return error500({ error: "Store not found." });

        const zone = isZoneAssigned.zone;
        const isOrderSorted = await SortedOrders.findOne({
            store: storeObjectId,
            date: today,
        });

        if (isOrderSorted) {
            if (orderType === "tiffin") {
                const orders = await getSortedTiffinOrderDetails(storeId, zone);

                const pending = isOrderSorted[zone].tiffin.filter(
                    (order: { status: string }) => order.status === "PENDING"
                );
                const delivered = isOrderSorted[zone].tiffin.filter(
                    (order: { status: string }) => order.status === "DELIVERED"
                );
                result.total = pending.length + delivered.length;
                result.pending = pending.length;
                result.completed = delivered.length;

                return success200({ data: { orders, result, haveZone: true } });
            } else {
                const orders = await getSortedCateringOrderDetails(
                    storeId,
                    zone
                );

                const pending = isOrderSorted[zone].catering.filter(
                    (order: { status: string }) => order.status === "PENDING"
                );
                const delivered = isOrderSorted[zone].catering.filter(
                    (order: { status: string }) => order.status === "DELIVERED"
                );
                result.total = pending.length + delivered.length;
                result.pending = pending.length;
                result.completed = delivered.length;

                return success200({ data: { orders, result, haveZone: true } });
            }
        }

        // Fetch and process orders for tiffin and catering
        const [tiffins, caterings] = await Promise.all([
            TiffinOrderStatus.find({
                store: storeObjectId,
                date: today,
                status: { $in: ["PENDING", "DELIVERED"] },
            }).populate({
                path: "orderId",
                model: Tiffin,
                populate: {
                    path: "address",
                    model: Address,
                    select: "lat lng",
                },
                select: "order_type orderId",
            }),
            Catering.find({
                store: storeObjectId,
                deliveryDate: today,
                status: { $in: ["PENDING", "DELIVERED"] },
                order_type: "delivery",
            })
                .select("orderId status")
                .populate({
                    path: "address",
                    model: Address,
                    select: "lat lng",
                }),
        ]);

        const tiffinDelivery = tiffins.filter(
            (order) => order.orderId.order_type === "delivery"
        );

        const tiffinClusterInput = tiffinDelivery.map((order) => ({
            id: order._id,
            lat: order.orderId.address.lat,
            lng: order.orderId.address.lng,
            orderId: order.orderId.orderId,
            status: order.status,
        }));
        const cateringClusterInput = caterings.map((order) => ({
            id: order._id,
            lat: order.address.lat,
            lng: order.address.lng,
            orderId: order.orderId,
            status: order.status,
        }));

        const [zone1TOrders, zone2TOrders] = clusterOrders(tiffinClusterInput);
        const [zone1COrders, zone2COrders] =
            clusterOrders(cateringClusterInput);

        const storeCoordinates = {
            lat: store.lat,
            lng: store.lng,
        };
        const sortedTOrders1 = findOptimalRoute(storeCoordinates, zone1TOrders);
        const sortedTOrders2 = findOptimalRoute(storeCoordinates, zone2TOrders);
        const sortedCOrders1 = findOptimalRoute(storeCoordinates, zone1COrders);
        const sortedCOrders2 = findOptimalRoute(storeCoordinates, zone2COrders);

        if (zone === 1 && orderType === "tiffin") {
            const pending = sortedTOrders1.filter(
                (order) => order.status === "PENDING"
            );
            const delivered = sortedTOrders1.filter(
                (order) => order.status === "DELIVERED"
            );
            result.total = pending.length + delivered.length;
            result.pending = pending.length;
            result.completed = delivered.length;
        } else if (zone === 2 && orderType === "tiffin") {
            const pending = sortedTOrders2.filter(
                (order) => order.status === "PENDING"
            );
            const delivered = sortedTOrders2.filter(
                (order) => order.status === "DELIVERED"
            );
            result.total = pending.length + delivered.length;
            result.pending = pending.length;
            result.completed = delivered.length;
        } else if (zone === 1 && orderType === "catering") {
            const pending = sortedCOrders1.filter(
                (order) => order.status === "PENDING"
            );
            const delivered = sortedCOrders1.filter(
                (order) => order.status === "DELIVERED"
            );
            result.total = pending.length + delivered.length;
            result.pending = pending.length;
            result.completed = delivered.length;
        } else if (zone === 2 && orderType === "catering") {
            const pending = sortedCOrders2.filter(
                (order) => order.status === "PENDING"
            );
            const delivered = sortedCOrders2.filter(
                (order) => order.status === "DELIVERED"
            );
            result.total = pending.length + delivered.length;
            result.pending = pending.length;
            result.completed = delivered.length;
        }

        await SortedOrders.findOneAndReplace(
            { store: storeObjectId },
            {
                store: storeObjectId,
                date: new Date(today),
                1: {
                    tiffin: sortedTOrders1.map((order) => ({
                        order: order.id,
                        status: order.status,
                    })),
                    catering: sortedCOrders1.map((order) => ({
                        order: order.id,
                        status: order.status,
                    })),
                },
                2: {
                    tiffin: sortedTOrders2.map((order) => ({
                        order: order.id,
                        status: order.status,
                    })),
                    catering: sortedCOrders2.map((order) => ({
                        order: order.id,
                        status: order.status,
                    })),
                },
            },
            { upsert: true, new: true }
        );

        if (orderType === "tiffin") {
            const orders = await getSortedTiffinOrderDetails(storeId, zone);
            return success200({ data: { orders, result, haveZone: true } });
        } else {
            const orders = await getSortedCateringOrderDetails(storeId, zone);
            return success200({ data: { orders, result, haveZone: true } });
        }
    } catch (error) {
        return error500({
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
