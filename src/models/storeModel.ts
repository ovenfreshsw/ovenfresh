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
        phone: String,
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

const Store = models?.Store || model<StoreDocument>("Store", StoreSchema);
export default Store;
