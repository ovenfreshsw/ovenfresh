import mongoose from "mongoose";
const { MONGODB_URI } = process.env;
const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(MONGODB_URI as string);
        console.log("Connected to MongoDB");
        if (connection.readyState === 1) {
            return Promise.resolve(true);
        }
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
};

export default connectDB;
