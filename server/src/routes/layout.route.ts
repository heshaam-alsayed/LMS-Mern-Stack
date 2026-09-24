import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware";
import {
  createLayout,
  getAllLayouts,
  getHeroStats,
  getLayoutByType,
  updateLayout,
} from "../controllers/layout.controller";
const router = express.Router();

router.get("/", getAllLayouts);

router.post(
  "/create-layout",
  isAuthenticated,
  authorizeRoles("admin"),
  createLayout,
);

router.put(
  "/update-layout",
  isAuthenticated,
  authorizeRoles("admin"),
  updateLayout,
);

router.get("/hero-stats", getHeroStats);


router.get("/:type", getLayoutByType);

export default router;
