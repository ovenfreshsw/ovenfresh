export interface CateringOrderState {
    store: string;
    deliveryDate: string;
    customerDetails: {
        firstName: string;
        lastName: string;
        phone: string;
        address: string;
        placeId: string;
        lat: string;
        lng: string;
    };
    payment_method: "cash" | "card";
    note?: string;
    totalPrice: number;
    tax: number;
    deliveryCharge: number;
    advancePaid: number;
    pendingBalance: number;
    fullyPaid: boolean;
    order_type: "pickup" | "delivery";
}

export interface CateringItemsState {
    _id: string;
    name: string;
    image: string;
    quantity: number;
    priceAtOrder: number;
}
