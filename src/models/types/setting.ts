import mongoose from "mongoose";

export interface SettingsDocument {
    _id: mongoose.Schema.Types.ObjectId;
    store: mongoose.Schema.Types.ObjectId;
    disable_sending_proof: boolean;
}
