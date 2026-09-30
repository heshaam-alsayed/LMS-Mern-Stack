import { Router } from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { getCourseProgress } from "../controllers/courseProgress.controller";
import express from "express";

const router = express.Router();

router.get("/:courseId/progress", isAuthenticated, getCourseProgress);

export default router;
