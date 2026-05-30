import express from "express";
import {
  activateUser,
  login,
  logout,
  refreshAccessToken,
  registrationUser,
  socialAuth,
} from "../controllers/auth.controller";
import {isAuthenticated } from "../middlewares/authMiddleware";
const router = express.Router();

router.route("/registration").post(registrationUser);
router.route("/activate-user").post(activateUser);
router.route("/login-user").post(login);
router.get("/logout-user", isAuthenticated, logout);
router.get("/refresh-token", refreshAccessToken);
router.post("/social-auth", socialAuth); 



export default router;
