import { Schema, model, models } from "mongoose";
import { CustomerDocument } from "./types/customer";

const CustomerSchema = new Schema<CustomerDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        zip: {
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
    { versionKey: false, timestamps: true }
);

const Customer =
    models?.Customer || model<CustomerDocument>("Customer", CustomerSchema);
export default Customer;
