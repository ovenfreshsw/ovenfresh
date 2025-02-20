import mongoose from "mongoose";

export interface AddressDocument {
    _id: mongoose.Schema.Types.ObjectId;
    customerId: mongoose.Schema.Types.ObjectId;
    address: string;
    lat: number;
    lng: number;
}
