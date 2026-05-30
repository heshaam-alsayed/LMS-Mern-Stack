import express from "express";
import { createOrder, getMonthlyOrdersAnalytics, getOrders } from "../controllers/order.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.get(
  "/monthly-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getMonthlyOrdersAnalytics,
);

router.get("/", isAuthenticated, authorizeRoles("admin"), getOrders);

export default router;