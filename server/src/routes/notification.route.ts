import express from "express";
import { isAuthenticated , authorizeRoles } from "../middlewares/authMiddleware";
import { getAllNotifications, updateNotification } from "../controllers/notification.controller";
const router = express.Router(); 


router.get("/",isAuthenticated, authorizeRoles("admin"), getAllNotifications);
router.patch("/update/:id",isAuthenticated, authorizeRoles("admin"), updateNotification);

export default router;