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
    statusId?: string;
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
    items?: {
        name: string;
        quantity: number;
    }[];
    customItems?: {
        name: string;
        size: string;
    }[];
    // };
    // status: string;
    // _id: string;
};
