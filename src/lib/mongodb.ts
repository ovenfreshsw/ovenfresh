import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

// Global cache for MongoDB connection (prevents multiple connections in Vercel)
let cached = (global as any).mongoose || { conn: null, promise: null };

const connectDB = async () => {
    if (cached.conn) {
        console.log("Using existing MongoDB connection");
        return cached.conn;
    }

    if (!cached.promise) {
        console.log("Creating new MongoDB connection...");
        cached.promise = mongoose
            .connect(MONGODB_URI)
            .then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

// Store cache globally (Vercel-specific optimization)
(global as any).mongoose = cached;

export default connectDB;
