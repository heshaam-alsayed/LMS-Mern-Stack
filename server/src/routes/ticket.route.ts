import { upload } from "../config/multer";
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware";
import {
  acceptTicket,
  closeTicket,
  createTicket,
  getAdminTicket,
  getAdminTicketMessages,
  getTicket,
  getTicketMessages,
  listAssignedTickets,
  listMyTickets,
  listTickets,
} from "../controllers/ticket.controller";
import express from "express";

const router = express.Router();

const adminOnly = [isAuthenticated, authorizeRoles("admin")];

router.post("/", upload.array("attachments", 5), createTicket);

router.get("/", adminOnly, listTickets);

// Registered before "/:ticketId" so the literal segment wins.
router.get("/my", isAuthenticated, listMyTickets);

router.get("/assigned", adminOnly, listAssignedTickets);

router.patch("/:ticketId/accept", adminOnly, acceptTicket);

// Registered before "/:ticketId" so the literal segment wins.
router.get("/admin/:ticketId", adminOnly, getAdminTicket);

router.get("/admin/:ticketId/messages", adminOnly, getAdminTicketMessages);

router.patch("/:ticketId/close", adminOnly, closeTicket);

router.get("/:ticketId", getTicket);
router.get("/:ticketId/messages", getTicketMessages);

export default router;