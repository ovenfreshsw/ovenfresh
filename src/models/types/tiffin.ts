import mongoose from "mongoose";
import { StoreDocument } from "./store";
import { CustomerDocument } from "./customer";
import { AddressDocument } from "./address";

export interface TiffinDocument {
    _id: string;
    orderId: string;
    store: mongoose.Schema.Types.ObjectId;
    customer: mongoose.Schema.Types.ObjectId;
    customerName: string;
    customerPhone: string;
    address: mongoose.Schema.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    numberOfWeeks: number;
    paymentMethod: string;
    advancePaid: number;
    pendingBalance: number;
    fullyPaid: boolean;
    totalPrice: number;
    tax: number;
    order_type: "pickup" | "delivery";
    note: string;
    extended: boolean;
    extendedFrom: string[];
    status: "PENDING" | "ONGOING" | "DELIVERED" | "CANCELLED";
}

// Use Omit<> to avoid repetition and improve maintainability
export interface TiffinDocumentPopulate
    extends Omit<TiffinDocument, "store" | "customer" | "address"> {
    store: StoreDocument;
    customer: CustomerDocument;
    address: AddressDocument;
    createdAt: Date;
    updatedAt: Date;
    individualStatus: {
        _id: string;
        orderId: string;
        date: Date;
        status: "PENDING" | "ONGOING" | "DELIVERED";
    }[];
}
