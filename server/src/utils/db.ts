import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


export const connectDB = async () => {
  try {
    const DB_URL = process.env.DB_URL;

    if (!DB_URL) {
      throw new Error("MONGO_URL is not defined");
    }

    const conn = await mongoose.connect(DB_URL);

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};