import mongoose from "mongoose";

export interface TiffinOrderStatusDocument {
    _id: string;
    orderId: mongoose.Schema.Types.ObjectId;
    store: mongoose.Schema.Types.ObjectId;
    date: Date;
    lunch: "PENDING" | "ONGOING" | "DELIVERED";
    dinner: "PENDING" | "ONGOING" | "DELIVERED";
}
