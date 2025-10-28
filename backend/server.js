import dotenv from "dotenv";
// Load env ASAP so all subsequent imports see process.env
dotenv.config({ path: "backend/.env" });

import app from "./app.js";
import connectDB from "./config/db.js";
import {v2 as cloudinary} from "cloudinary";
import Razorpay from "razorpay";


// Fallback load in non-production environments (harmless if already loaded)
if (process.env.NODE_ENV !== 'PRODUCTION') {
  dotenv.config({ path: "backend/.env" });
}

const PORT = process.env.PORT || 3000;

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

connectDB();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});

