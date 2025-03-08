import mongoose, { Schema, model, models } from "mongoose";
import { SortedOrdersDocument } from "./types/sorted-orders";

const SortedOrdersSchema = new Schema<SortedOrdersDocument>(
    {
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        1: {
            tiffin: [
                {
                    order: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "TiffinOrderStatus",
                    },
                    status: {
                        type: String,
                        enum: ["PENDING", "DELIVERED"],
                    },
                },
            ],
            catering: [
                {
                    order: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Catering",
                    },
                    status: {
                        type: String,
                        enum: ["PENDING", "DELIVERED"],
                    },
                },
            ],
        },
        2: {
            tiffin: [
                {
                    order: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "TiffinOrderStatus",
                    },
                    status: {
                        type: String,
                        enum: ["PENDING", "DELIVERED"],
                    },
                },
            ],
            catering: [
                {
                    order: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Catering",
                    },
                    status: {
                        type: String,
                        enum: ["PENDING", "DELIVERED"],
                    },
                },
            ],
        },
    },
    { versionKey: false }
);

const SortedOrders =
    models?.SortedOrders ||
    model<SortedOrdersDocument>("SortedOrders", SortedOrdersSchema);
export default SortedOrders;
