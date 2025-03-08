import mongoose from "mongoose";
import { TiffinDocumentPopulate } from "./tiffin";

export interface TiffinOrderStatusDocument {
    _id: string;
    orderId: mongoose.Schema.Types.ObjectId;
    store: mongoose.Schema.Types.ObjectId;
    date: Date;
    status: "PENDING" | "ONGOING" | "DELIVERED";
}

export interface TiffinOrderStatusDocumentPopulate
    extends Omit<TiffinOrderStatusDocument, "orderId"> {
    orderId: TiffinDocumentPopulate;
}
