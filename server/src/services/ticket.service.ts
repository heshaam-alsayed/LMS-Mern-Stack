import mongoose, { isValidObjectId } from "mongoose";

import {
  createTicketMessage,
  getFirstTicketMessageAttachments,
  getTicketMessagesByTicketId,
} from "../repositories/ticket-message.repository";

import {
  acceptTicket as acceptTicketInRepository,
  closeTicket as closeTicketInRepository,
  createTicket,
  getTicketById,
  listAssignedTickets as listAssignedTicketsInRepository,
  listMyTickets as listMyTicketsInRepository,
  listTickets as listTicketsInRepository,
} from "../repositories/ticket.repository";

import { getUserByEmail } from "../repositories/user.repository";
import { createNotification } from "../repositories/notification.repository";
import AppError from "../utils/AppError";

import {
  deleteFromCloudinary,
  uploadToCloudinary,
  type CloudinaryResourceType,
} from "../utils/uploadToCloudinary";

import type { TicketStatus } from "../models/ticket.model";
import { PopulatedTicket } from "../interfaces/ticket";
import { getIO } from "../socketServer";

type Attachment = {
  url: string;
  publicId: string;
  name: string;
  type: string;
  size: number;
  resourceType: CloudinaryResourceType;
};

type CreateTicketData = {
  user?: string;
  email?: string;
  subject: string;
  category: string;
  message?: string;
  files?: Express.Multer.File[];
};

const TICKET_FOLDER = "LMS/tickets";

const getExistingTicket = async (
  ticketId: string,
): Promise<PopulatedTicket> => {
  if (!ticketId) {
    throw new AppError("Ticket id is required", 400);
  }

  if (!isValidObjectId(ticketId)) {
    throw new AppError("Invalid ticket ID", 400);
  }

  const ticket = await getTicketById(ticketId);

  if (!ticket) {
    throw new AppError("Ticket not found", 404);
  }

  return ticket;
};

const getTicketWithAttachments = async (
  ticket: PopulatedTicket,
) => {
  const attachments =
    await getFirstTicketMessageAttachments(
      ticket._id.toString(),
    );

  return {
    ...ticket,
    attachments,
  };
};

const checkAdminTicketAccess = (
  ticket: PopulatedTicket,
  adminId: string,
) => {
  const assignedAdminId =
    ticket.assignedTo?._id.toString();

  if (
    ticket.status === "open" ||
    assignedAdminId === adminId
  ) {
    return;
  }

  throw new AppError(
    "You do not have access to this ticket. It is assigned to another admin.",
    403,
  );
};

export const getTicketDetails = async (
  ticketId: string,
) => {
  const ticket = await getExistingTicket(ticketId);

  return getTicketWithAttachments(ticket);
};

export const getTicketHistory = async (
  ticketId: string,
) => {
  await getExistingTicket(ticketId);

  return getTicketMessagesByTicketId(ticketId);
};

export const getAdminTicketDetailsService = async (
  ticketId: string,
  adminId: string,
) => {
  if (!adminId) {
    throw new AppError("Not authenticated", 401);
  }

  const ticket = await getExistingTicket(ticketId);

  checkAdminTicketAccess(ticket, adminId);

  return getTicketWithAttachments(ticket);
};

export const getAdminTicketHistory = async (
  ticketId: string,
  adminId: string,
) => {
  const ticket = await getExistingTicket(ticketId);

  checkAdminTicketAccess(ticket, adminId);

  return getTicketMessagesByTicketId(ticketId);
};

const TICKET_STATUS_LABELS = {
  open: "open",
  in_progress: "in progress",
  closed: "closed",
};

export const acceptTicketService = async (
  ticketId: string,
  adminId: string,
) => {
  if (!adminId) {
    throw new AppError("Not authenticated", 401);
  }

  if (!isValidObjectId(adminId)) {
    throw new AppError("Invalid admin ID", 401);
  }

  const ticket = await getExistingTicket(ticketId);

  if (ticket.status !== "open") {
    throw new AppError(
      `Ticket cannot be accepted because it is already ${ticket.status}`,
      409,
    );
  }

  const acceptedTicket =
    await acceptTicketInRepository(
      ticketId,
      adminId,
    );

  if (!acceptedTicket) {
    throw new AppError(
      "This ticket was accepted by another admin. Refresh to see the current status.",
      409,
    );
  }

  try {
    const io = getIO();

    const userId =
      acceptedTicket.user._id.toString();

    io.to(`user:${userId}`).emit(
      "ticket:accepted",
      {
        ticketId:
          acceptedTicket._id.toString(),
        status: "in_progress",
        assignedTo: adminId,
      },
    );
  } catch (error) {
    console.error(
      "Failed to emit ticket:accepted event",
      error,
    );
  }

  return getTicketWithAttachments(
    acceptedTicket,
  );
};

export const listTicketsService = async (options: {
  page: number;
  limit: number;
  status?: TicketStatus;
}) => {
  const { status } = options;

  if (
    status &&
    !(status in TICKET_STATUS_LABELS)
  ) {
    throw new AppError(
      "Invalid ticket status filter",
      400,
    );
  }

  return listTicketsInRepository(options);
};

export const listMyTicketsService = async (options: {
  userId: string;
  page: number;
  limit: number;
  status?: TicketStatus;
}) => {
  const { status } = options;

  if (
    status &&
    !(status in TICKET_STATUS_LABELS)
  ) {
    throw new AppError(
      "Invalid ticket status filter",
      400,
    );
  }

  return listMyTicketsInRepository(options);
};

export const listAssignedTicketsService = async (options: {
  adminId: string;
  page: number;
  limit: number;
  status?: TicketStatus;
}) => {
  const { status } = options;

  if (
    status &&
    !(status in TICKET_STATUS_LABELS)
  ) {
    throw new AppError(
      "Invalid ticket status filter",
      400,
    );
  }

  return listAssignedTicketsInRepository(options);
};

export const createTicketWithFirstMessage = async (
  data: CreateTicketData,
) => {
  const subject = data.subject?.trim();
  const message = data.message?.trim();
  const files = data.files ?? [];

  if (!subject) {
    throw new AppError("Subject is required", 400);
  }

  if (!message && files.length === 0) {
    throw new AppError(
      "Ticket must contain a message or attachment",
      400,
    );
  }

  // Get user
  let userId = data.user;

  if (!userId) {
    if (!data.email) {
      throw new AppError("Email is required", 400);
    }

    const user = await getUserByEmail(data.email.trim());

    if (!user) {
      throw new AppError(
        "User with this email was not found",
        404,
      );
    }

    userId = user._id.toString();
  }

  const uploadedFiles: {
    publicId: string;
    resourceType: CloudinaryResourceType;
  }[] = [];

  const attachments: Attachment[] = [];

  try {
    // Upload attachments
    for (const file of files) {
      const resourceType = file.mimetype.startsWith("image/")
        ? "image"
        : "raw";

      const uploadedFile = await uploadToCloudinary(
        file.buffer,
        TICKET_FOLDER,
        resourceType,
      );

      uploadedFiles.push({
        publicId: uploadedFile.public_id,
        resourceType,
      });

      attachments.push({
        url: uploadedFile.secure_url,
        publicId: uploadedFile.public_id,
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        resourceType,
      });
    }

    // Create ticket + first message
    const session = await mongoose.startSession();

    let ticket;
    let ticketMessage;

    try {
      await session.withTransaction(async () => {
        ticket = await createTicket(
          {
            user: userId!,
            subject,
            category: data.category,
          },
          session,
        );

        ticketMessage = await createTicketMessage(
          {
            ticket: ticket._id,
            sender: userId!,
            message: message || undefined,
            attachments,
          },
          session,
        );
      });
    } finally {
      await session.endSession();
    }

    // Create admin notification
    const notification = await createNotification({
      title: "New Support Ticket",
      message: `A new support ticket was created: ${subject}`,
      user: userId!,
    });

    // Notify admins in realtime
    getIO().to("admins").emit("notification", notification);

    return {
      ticket,
      ticketMessage,
    };
  } catch (error) {
    // Delete uploaded files if database operation fails
    for (const file of uploadedFiles) {
      await deleteFromCloudinary(
        file.publicId,
        file.resourceType,
      );
    }

    throw error;
  }
};

export const closeTicketService = async (
  ticketId: string,
  adminId: string,
) => {
  if (!adminId) {
    throw new AppError(
      "Not authenticated",
      401,
    );
  }

  if (!isValidObjectId(adminId)) {
    throw new AppError(
      "Invalid admin ID",
      401,
    );
  }

  const ticket =
    await getExistingTicket(ticketId);

  const assignedAdminId =
    ticket.assignedTo?._id.toString();

  if (assignedAdminId !== adminId) {
    throw new AppError(
      "Only the assigned admin can close this ticket",
      403,
    );
  }

  if (ticket.status === "closed") {
    return getTicketWithAttachments(ticket);
  }

  const closedTicket =
    await closeTicketInRepository(ticketId);

  if (!closedTicket) {
    throw new AppError(
      "Failed to close ticket",
      500,
    );
  }

  try {
    const io = getIO();

    const userId =
      closedTicket.user._id.toString();

    const payload = {
      ticketId:
        closedTicket._id.toString(),
      status: "closed",
    };

    io.to(`ticket:${ticketId}`).emit(
      "ticket:closed",
      payload,
    );

    io.to(`user:${userId}`).emit(
      "ticket:closed",
      payload,
    );
  } catch (error) {
    console.error(
      "Failed to emit ticket:closed event",
      error,
    );
  }

  return getTicketWithAttachments(
    closedTicket,
  );
};