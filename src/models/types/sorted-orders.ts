import mongoose from "mongoose";

export interface SortedOrdersDocument {
    _id: string;
    store: mongoose.Schema.Types.ObjectId;
    date: Date;
    1: {
        tiffin: {
            order: mongoose.Schema.Types.ObjectId;
            status: string;
        }[];
        catering: {
            order: mongoose.Schema.Types.ObjectId;
            status: string;
        }[];
    };
    2: {
        tiffin: {
            order: mongoose.Schema.Types.ObjectId;
            status: string;
        }[];
        catering: {
            order: mongoose.Schema.Types.ObjectId;
            status: string;
        }[];
    };
}
