import mongoose from "mongoose";

export interface AddressDocument {
    _id: mongoose.Schema.Types.ObjectId;
    customerId: mongoose.Schema.Types.ObjectId;
    address: string;
    placeId: string;
    aptSuiteUnit: string;
    street: string;
    city: string;
    province: string;
    zipCode: string;
    lat: number;
    lng: number;
}
