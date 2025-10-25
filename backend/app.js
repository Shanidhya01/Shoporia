import express from 'express';
import product from "./routes/productRoutes.js"
import user from "./routes/userRoutes.js"
import order from "./routes/orderRoutes.js"
import cookieParser from "cookie-parser"
import fileupload from "express-fileupload"
import dotenv from "dotenv"
import payment from "./routes/paymentRoutes.js"
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(fileupload());

//Routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// Static Files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all route for SPA, must be last
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

if(process.env.NODE_ENV !== 'PRODUCTION'){
  dotenv.config({path: "backend/.env"});
}

export default app;
