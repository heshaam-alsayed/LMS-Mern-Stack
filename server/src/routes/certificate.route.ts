import { Router } from "express";

import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware";
import {
  generateCertificate,
  getCertificate,
  getAllCertificates,
} from "../controllers/certificate.controller";

const router = Router();

router.use(isAuthenticated);

router.get("/all", authorizeRoles("admin"), getAllCertificates);

router.post("/generate/:courseId", generateCertificate);

router.get("/verify/:courseId", getCertificate);

export default router;
