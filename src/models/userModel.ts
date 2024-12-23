import { Schema, model, models } from "mongoose";
import { UserDocument } from "./types/user";

const UserSchema = new Schema<UserDocument>(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "Username is required"],
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        storeId: {
            type: Schema.Types.Mixed,
        },
        iv: String
    },
    { versionKey: false }
);

const User = models?.User || model<UserDocument>("User", UserSchema);
export default User;
