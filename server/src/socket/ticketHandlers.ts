import { Server, Socket } from "socket.io";
import { isValidObjectId } from "mongoose";

import { getTicketById } from "../repositories/ticket.repository";
import { createTicketMessage } from "../repositories/ticket-message.repository";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

type TicketFile = {
  name: string;
  type: string;
  size: number;
  data: Buffer;
};

type TicketAttachment = {
  url: string;
  publicId: string;
  name: string;
  type: string;
  size: number;
  resourceType: "image" | "raw";
};

type TicketMessageData = {
  ticketId: string;
  message?: string;
  files?: TicketFile[];
  clientId?: string;
};

type SocketUser = {
  _id: string;
  role: string;
};

const MAX_ATTACHMENT_SIZE = 8 * 1024 * 1024;
const MAX_ATTACHMENT_COUNT = 6;

const sendTicketError = (socket: Socket, message: string) => {
  socket.emit("ticket:error", { message });
};


const uploadTicketFiles = async (
  files: TicketFile[],
): Promise<TicketAttachment[]> => {
  const attachments: TicketAttachment[] = [];

  for (const file of files) {
    if (file.size > MAX_ATTACHMENT_SIZE) {
      throw new Error(
        "File exceeds the 8 MB size limit",
      );
    }

    const name = file.name || "attachment";
    const type = file.type || "application/octet-stream";

    let resourceType: "image" | "raw" = "raw";

    if (type.startsWith("image/")) {
      resourceType = "image";
    }

    const uploadedFile = await uploadToCloudinary(
      file.data,
      "LMS/tickets",
      resourceType,
    );

    attachments.push({
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
      name,
      type,
      size: file.size,
      resourceType,
    });
  }

  return attachments;
};

const getUserRefId = (
  value: string | { _id?: unknown } | null | undefined,
): string | null => {
  if (!value) return null;

  if (typeof value === "string") return value;

  if (value._id) return String(value._id);

  return null;
};

const userCanAccessTicket = (
  ticket: any,
  user: SocketUser,
): boolean => {
  const userId = String(user._id);

  if (user.role === "admin") {
    return getUserRefId(ticket.assignedTo) === userId;
  }

  return getUserRefId(ticket.user) === userId;
};

const handleJoinTicket = async (
  socket: Socket,
  ticketId: string,
) => {
  const user = socket.data.user as SocketUser;

  if (!user) {
    sendTicketError(socket, "Not authenticated");
    return;
  }

  if (!ticketId || !isValidObjectId(ticketId)) {
    sendTicketError(socket, "Invalid ticket ID");
    return;
  }

  const ticket = await getTicketById(ticketId);

  if (!ticket) {
    sendTicketError(socket, "Ticket not found");
    return;
  }

  const canAccess = userCanAccessTicket(ticket, user);

  if (!canAccess) {
    sendTicketError(
      socket,
      "You do not have access to this ticket chat",
    );
    return;
  }

  await socket.join(`ticket:${ticketId}`);
};

const handleLeaveTicket = async (
  socket: Socket,
  ticketId: string,
) => {
  if (!ticketId || !isValidObjectId(ticketId)) {
    return;
  }

  await socket.leave(`ticket:${ticketId}`);
};

const handleTicketMessage = async (
  io: Server,
  socket: Socket,
  data: TicketMessageData,
) => {
  const user = socket.data.user as SocketUser;

  if (!user) {
    sendTicketError(socket, "Not authenticated");
    return;
  }

  const ticketId = data.ticketId;

  if (!ticketId || !isValidObjectId(ticketId)) {
    sendTicketError(socket, "Invalid ticket ID");
    return;
  }

  const message = data.message?.trim();
  const files = data.files || [];

  if (!message && files.length === 0) {
    sendTicketError(
      socket,
      "Message or attachment is required",
    );
    return;
  }

  if (files.length > MAX_ATTACHMENT_COUNT) {
    sendTicketError(
      socket,
      `You can attach up to ${MAX_ATTACHMENT_COUNT} files`,
    );
    return;
  }

  const ticket = await getTicketById(ticketId);

  if (!ticket) {
    sendTicketError(socket, "Ticket not found");
    return;
  }

  if (ticket.status !== "in_progress") {
    sendTicketError(
      socket,
      "Chat is only available for tickets in progress",
    );
    return;
  }

  const canAccess = userCanAccessTicket(ticket, user);

  if (!canAccess) {
    if (user.role === "admin") {
      sendTicketError(
        socket,
        "You are not assigned to this ticket",
      );
      return;
    }

    sendTicketError(
      socket,
      "You are not allowed to send messages to this ticket",
    );
    return;
  }

  let attachments: TicketAttachment[] = [];

  if (files.length > 0) {
    attachments = await uploadTicketFiles(files);
  }

  const newMessage = await createTicketMessage({
    ticket: ticket._id,
    sender: user._id,
    message,
    attachments,
  });

  const populated = (
    await newMessage.populate("sender", "name email avatar role")
  ).toObject();

  if (data.clientId) {
    (populated as any).clientId = data.clientId;
  }

  io.to(`ticket:${ticketId}`).emit(
    "ticket:message",
    populated,
  );
};

export const registerTicketHandlers = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("ticket:join", async (ticketId: string) => {
      try {
        await handleJoinTicket(socket, ticketId);
      } catch (error: any) {
        sendTicketError(
          socket,
          error?.message || "Failed to join ticket chat",
        );
      }
    });

    socket.on("ticket:leave", async (ticketId: string) => {
      try {
        await handleLeaveTicket(socket, ticketId);
      } catch (error: any) {
        sendTicketError(
          socket,
          error?.message || "Failed to leave ticket chat",
        );
      }
    });

    socket.on(
      "ticket:message",
      async (data: TicketMessageData) => {
        try {
          await handleTicketMessage(
            io,
            socket,
            data,
          );
        } catch (error: any) {
          sendTicketError(
            socket,
            error?.message || "Failed to send message",
          );
        }
      },
    );
  });
};