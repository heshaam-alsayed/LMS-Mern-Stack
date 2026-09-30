import { Router } from "express";

import { isAuthenticated } from "../middlewares/authMiddleware";
import {
  generateCertificate,
  getCertificate,
} from "../controllers/certificate.controller";

const router = Router();

router.use(isAuthenticated);

router.post("/generate/:courseId", generateCertificate);

router.get("/verify/:courseId", getCertificate);

export default router;
