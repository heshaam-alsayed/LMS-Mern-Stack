import express from "express";
import { isAuthenticated , authorizeRoles } from "../middlewares/authMiddleware";
import { getAllNotifications, updateNotification } from "../controllers/notification.controller";
const router = express.Router(); 


router.get("/",isAuthenticated, authorizeRoles("admin", "instructor"), getAllNotifications);
router.patch("/update/:id",isAuthenticated, authorizeRoles("admin", "instructor"), updateNotification);

export default router;