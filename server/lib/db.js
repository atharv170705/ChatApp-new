import mongoose from "mongoose";

// connect to the database

export const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
        console.log(`\nMongoDB connected! DB host : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1);
    }
}