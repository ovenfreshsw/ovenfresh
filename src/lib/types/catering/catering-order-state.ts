export interface CateringOrderState {
    store: string;
    deliveryDate: string;
    customerDetails: {
        firstName: string;
        lastName: string;
        phone: string;
        address: string;
        lat: string;
        lng: string;
    };
    payment_method: "cash" | "card";
    note?: string;
    totalPrice: number;
    tax: number;
    advancePaid: number;
    pendingBalance: number;
    fullyPaid: boolean;
}

export interface CateringItemsState {
    _id: string;
    name: string;
    image: string;
    quantity: number;
    priceAtOrder: number;
}
