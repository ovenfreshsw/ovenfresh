import mongoose from "mongoose";

export interface GroceryDocument {
    _id: string;
    store: mongoose.Types.ObjectId;
    item: string;
    quantity: number;
    unit: "l" | "kg" | "g" | "lbs" | "Pcs" | "Nos" | "none" | "Mixed";
    price: number;
    tax: number;
    total: number;
    date: Date;
}
