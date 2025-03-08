import { OrderStatus } from "./order-status";

export type ClusteredOrderProps = {
    id: string;
    orderId: string;
    lat: number;
    lng: number;
    status: string;
    zone?: number;
};

export type DeliveryRes = {
    _id: string;
    orderId: string;
    customerName: string;
    customerPhone: string;
    status: string;
    fullyPaid: boolean;
    pendingBalance: number;
    totalPrice: number;
    advancePaid: number;
    address: {
        address: string;
        lat: number;
        lng: number;
    };
    date: Date;
    // };
    // status: string;
    // _id: string;
};
