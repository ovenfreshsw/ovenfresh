import mongoose from "mongoose";
import { CustomerDocument } from "./customer";
import { StoreDocument } from "./store";
import { AddressDocument } from "./address";
import { CateringMenuDocument } from "./catering-menu";

export interface CateringDocument {
    _id: mongoose.Schema.Types.ObjectId;
    orderId: string;
    store: mongoose.Schema.Types.ObjectId;
    customer: mongoose.Schema.Types.ObjectId | CustomerDocument;
    address: mongoose.Schema.Types.ObjectId;
    customerName: string;
    customerPhone: string;
    deliveryDate: Date;
    items: {
        itemId: string;
        priceAtOrder: number;
        quantity: number;
        size: string;
    }[];
    advancePaid: number;
    pendingBalance: number;
    fullyPaid: boolean;
    paymentMethod: string;
    order_type: "pickup" | "delivery";
    totalPrice: number;
    tax: number;
    deliveryCharge: number;
    note: string;
    status: "PENDING" | "ONGOING" | "DELIVERED" | "CANCELLED";
}

// Use Omit<> to avoid repetition and improve maintainability
export interface CateringDocumentPopulate
    extends Omit<CateringDocument, "store" | "customer" | "address" | "items"> {
    store: StoreDocument;
    customer: CustomerDocument;
    address: AddressDocument;
    items: {
        itemId: CateringMenuDocument;
        priceAtOrder: number;
        quantity: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
