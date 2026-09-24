import { Router } from "express";
import {
    approveInstructorApplication,
  createInstructorApplication,
  getAllOrganizationApplications,
  getOrganizationApplication,
  getOrganizationApplicationAdmin,
  rejectInstructorApplication,
} from "../controllers/instructorApplication.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", createInstructorApplication);
router.get("/status", getOrganizationApplication);

router.get(
  "/admin",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrganizationApplications,
);

router.get(
  "/admin/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  getOrganizationApplicationAdmin,
);

router.patch(
  "/admin/:id/approve",
  isAuthenticated,
  authorizeRoles("admin"),
  approveInstructorApplication,
);

router.patch(
  "/admin/:id/reject",
  isAuthenticated,
  authorizeRoles("admin"),
  rejectInstructorApplication,
);

export default router;
