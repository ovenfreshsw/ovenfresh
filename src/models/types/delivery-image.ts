import mongoose from "mongoose";

export interface DeliveryImageDocument {
    order: mongoose.Schema.Types.ObjectId;
    store: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    deliveryDate: Date;
    messageStatus: string;
    image: string;
    publicId: string;
}
