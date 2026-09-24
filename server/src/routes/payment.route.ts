import express from "express";
import {
} from "../controllers/order.controller";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { getStripePublishableKey, newPayment, stripeWebhook } from "../controllers/payment.controller";
const router = express.Router();

router.get("/stripepublishablekey", getStripePublishableKey);
router.post("/create-intent", isAuthenticated, newPayment);
router.post("/webhook", stripeWebhook);


export default router;
