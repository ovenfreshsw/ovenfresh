import mongoose, { Schema, model, models } from "mongoose";
import { DeliveryImageDocument } from "./types/delivery-image";

const DeliveryImageSchema = new Schema<DeliveryImageDocument>(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tiffin",
            required: true,
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        deliveryDate: {
            type: Date,
            required: true,
        },
        messageStatus: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

const DeliveryImage =
    models?.DeliveryImage ||
    model<DeliveryImageDocument>("DeliveryImage", DeliveryImageSchema);
export default DeliveryImage;
