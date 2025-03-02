import mongoose, { Schema, model, models } from "mongoose";
import { TiffinOrderStatusDocument } from "./types/tiffin-order-status";

const TiffinOrderStatusSchema = new Schema<TiffinOrderStatusDocument>(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tiffin",
            required: true,
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        lunch: {
            type: String,
            enum: ["PENDING", "ONGOING", "DELIVERED", "CANCELLED"],
            default: "PENDING",
        },
        dinner: {
            type: String,
            enum: ["PENDING", "ONGOING", "DELIVERED", "CANCELLED"],
            default: "PENDING",
        },
    },
    { versionKey: false, timestamps: true }
);

const TiffinOrderStatus =
    models["Tiffin-Order-Status"] ||
    model<TiffinOrderStatusDocument>(
        "Tiffin-Order-Status",
        TiffinOrderStatusSchema
    );
export default TiffinOrderStatus;
