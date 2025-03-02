import mongoose, { Schema, model, models } from "mongoose";
import { CateringDocument } from "./types/catering";

const CateringSchema = new Schema<CateringDocument>(
    {
        orderId: {
            type: String,
            require: true,
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: true,
        },
        customerName: {
            type: String,
            required: true,
        },
        customerPhone: {
            type: String,
            required: true,
        },
        deliveryDate: {
            type: Date,
            required: true,
        },
        items: {
            type: [
                {
                    itemId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "CateringMenu", // Reference to the Item collection
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        min: 1,
                    },
                    priceAtOrder: {
                        // Store the price at the time of order
                        type: Number,
                        required: true,
                    },
                },
            ],
            required: true,
        },
        advancePaid: {
            type: Number,
            required: true,
        },
        pendingBalance: {
            type: Number,
            required: true,
        },
        fullyPaid: {
            type: Boolean,
            default: false,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        tax: Number,
        deliveryCharge: Number,
        note: String,
        order_type: {
            type: String,
            enum: ["pickup", "delivery"],
            required: true,
        },
        status: {
            type: String,
            enum: ["PENDING", "ONGOING", "DELIVERED", "CANCELLED"],
            default: "PENDING",
        },
    },
    { versionKey: false, timestamps: true }
);

// Create a unique index for orderId
CateringSchema.index({ orderId: 1 }, { unique: true });

const Catering =
    models?.Catering || model<CateringDocument>("Catering", CateringSchema);
export default Catering;
