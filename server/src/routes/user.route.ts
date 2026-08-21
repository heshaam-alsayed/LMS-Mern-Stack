import express from "express";
import {
  changeRole,
  createUser,
  getMe,
  getMonthlyUsersAnalytics,
  getUserById,
  getUsers,
  toggleUserDeleted,
  updateAvatar,
  updatePassword,
  updateUserInfo,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/me", isAuthenticated, getMe);
router.patch("/update-me", isAuthenticated, updateUserInfo);
router.patch("/update-password", isAuthenticated, updatePassword);
router.patch("/update-avatar", isAuthenticated, updateAvatar);
router.patch(
  "/change-role",
  isAuthenticated,
  authorizeRoles("admin"),
  changeRole,
);

router.patch(
  "/toggle-user-deleted/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  toggleUserDeleted,
);

router.get(
  "/monthly-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getMonthlyUsersAnalytics,
);

router.get("/:id", getUserById);
router.get("/", isAuthenticated, authorizeRoles("admin"), getUsers);
router.post(
  "/create-member",
  isAuthenticated,
  authorizeRoles("admin"),
  createUser,
);

export default router;
