import mongoose, { Schema, model, models } from "mongoose";
import { AddressDocument } from "./types/address";

const AddressSchema = new Schema<AddressDocument>(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Customer",
        },
        address: {
            type: String,
            required: true,
        },
        placeId: {
            type: String,
            required: true,
        },
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
    },
    { versionKey: false }
);

const Address =
    models?.Address || model<AddressDocument>("Address", AddressSchema);
export default Address;
