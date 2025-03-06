import { Schema, model, models } from "mongoose";
import { StoreDocument } from "./types/store";

const StoreSchema = new Schema<StoreDocument>(
    {
        name: {
            type: String,
            unique: true,
        },
        address: {
            type: String,
            required: true,
        },
        placeId: {
            type: String,
            required: true,
        },
        location: {
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
        phone: String,
    },
    { versionKey: false }
);

const Store = models?.Store || model<StoreDocument>("Store", StoreSchema);
export default Store;
