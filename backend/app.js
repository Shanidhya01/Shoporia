import express from 'express';
import product from "./routes/productRoutes.js"
import user from "./routes/userRoutes.js"
import order from "./routes/orderRoutes.js"
import cookieParser from "cookie-parser"
import fileupload from "express-fileupload"

const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(fileupload());

//Routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

export default app;
