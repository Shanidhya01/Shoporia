import express from 'express';
import product from "./routes/productRoutes.js"
import user from "./routes/userRoutes.js"
import cookieParser from "cookie-parser"

const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/v1", product);
app.use("/api/v1", user);

export default app;
