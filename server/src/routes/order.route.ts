import express from "express";
import {
  getMonthlyGrowthAnalytics,
  getMonthlyOrdersAnalytics,
  getOrders,
  getOrdersMonthlyAnalytics,
  getOrdersStatistics,
} from "../controllers/order.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware";
const router = express.Router();

// router.post("/create-order", isAuthenticated, createOrder);
router.get(
  "/monthly-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getMonthlyOrdersAnalytics,
);
router.get(
  "/revenue-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getOrdersMonthlyAnalytics,
);
router.get(
  "/analytics/statistics",
  isAuthenticated,
  authorizeRoles("admin"),
  getOrdersStatistics,
);
router.get(
  "/monthly-growth",
  isAuthenticated,
  authorizeRoles("admin"),
  getMonthlyGrowthAnalytics,
);

router.get("/", isAuthenticated, authorizeRoles("admin"), getOrders);

export default router;
