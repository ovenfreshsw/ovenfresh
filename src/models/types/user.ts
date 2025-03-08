import mongoose from "mongoose";
import { StoreDocument } from "./store";

export interface UserDocument {
    _id: string;
    username: string;
    role: "SUPERADMIN" | "ADMIN" | "MANAGER" | "DELIVERY";
    password: string;
    lpp: string;
    storeId: mongoose.Schema.Types.ObjectId | null;
    iv?: string;
    zone?: number;
}

export interface UserDocumentPopulate extends Omit<UserDocument, "storeId"> {
    storeId: StoreDocument;
}
