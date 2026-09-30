import {
  getUploadCredentials,
  getVideoStatusHandler,
} from "../controllers/vdocipher.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware";

const express = require("express");
const router = express.Router();

router.post(
  "/upload/credentials",
  isAuthenticated,
  authorizeRoles("instructor", "admin"),
  getUploadCredentials,
);

router.post(
  "/video/status",
  isAuthenticated,
  authorizeRoles("instructor", "admin"),
  getVideoStatusHandler,
);

export default router;
