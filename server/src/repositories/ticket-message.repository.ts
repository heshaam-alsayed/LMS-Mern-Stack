import mongoose from "mongoose";

import TicketMessageModel from "../models/ticket-message.model";

type Attachment = {
  url: string;
  publicId: string;
  name: string;
  type: string;
  size: number;
  resourceType?: "image" | "raw";
};

type CreateTicketMessageData = {
  ticket: mongoose.Types.ObjectId;
  sender: string;
  message?: string;
  attachments: Attachment[];
};

export const createTicketMessage = async (
  data: CreateTicketMessageData,
  session?: mongoose.ClientSession,
) => {
  const ticketMessage = new TicketMessageModel(data);

  await ticketMessage.save({ session });

  return ticketMessage;
};

export const getTicketMessagesByTicketId = async (
  ticketId: string,
) => {
  return TicketMessageModel.find({
    ticket: ticketId,
  })
    .populate("sender", "name email avatar role")
    .sort({ createdAt: 1 })
    .lean();
};

export const getFirstTicketMessageAttachments = async (
  ticketId: string,
) => {
  const firstMessage = await TicketMessageModel.findOne({
    ticket: ticketId,
  })
    .select("attachments")
    .sort({ createdAt: 1 })
    .lean();

  return firstMessage?.attachments ?? [];
};