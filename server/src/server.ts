import { app } from "./app";
import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "./utils/db";
import http from "http"; 
import { initSocketServer } from "./socketServer";
const PORT = process.env.PORT;

connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const server = http.createServer(app);
initSocketServer(server)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
