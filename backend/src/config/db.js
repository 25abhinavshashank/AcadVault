import "./env.js";
import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in the backend .env file.");
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      socketTimeoutMS: 8000
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    const reason = error?.reason ? ` Reason: ${error.reason}` : "";
    throw new Error(`${error.message}${reason}`);
  }
};

export default connectDB;
