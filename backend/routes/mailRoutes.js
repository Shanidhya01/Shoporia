import express from "express";
import { sendContactMail } from "../controller/mailController.js";

const router = express.Router();

// Public endpoint to send contact email
router.post("/send-mail", sendContactMail);

export default router;
