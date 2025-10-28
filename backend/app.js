import express from 'express';
import product from "./routes/productRoutes.js"
import user from "./routes/userRoutes.js"
import order from "./routes/orderRoutes.js"
import cookieParser from "cookie-parser"
import fileupload from "express-fileupload"
import dotenv from "dotenv"
import payment from "./routes/paymentRoutes.js"
import mail from "./routes/mailRoutes.js"
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//Middlewares
// Increase body limits to accommodate base64 avatars (~0.5MB)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());
app.use(fileupload({ limits: { fileSize: 2 * 1024 * 1024 } }));

// Return JSON for payload-too-large instead of HTML
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Payload too large' });
  }
  next(err);
});

//Routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", mail);

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
