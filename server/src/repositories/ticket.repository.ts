import TicketModel from "../models/ticket.model";
import mongoose from "mongoose";

import type { TicketStatus } from "../models/ticket.model";
import type { PopulatedTicket } from "../interfaces/ticket";

export const createTicket = async (
  data: {
    user: string;
    subject: string;
    category: string;
  },
  session: mongoose.ClientSession,
) => {
  const ticket = new TicketModel(data);

  await ticket.save({ session });

  return ticket;
};

export const getTicketById = async (
  ticketId: string,
): Promise<PopulatedTicket | null> => {
  const ticket = await TicketModel.findById(ticketId)
    .populate("user", "name email avatar")
    .populate("assignedTo", "name email avatar")
    .lean();

  return ticket as PopulatedTicket | null;
};

export const acceptTicket = async (
  ticketId: string,
  adminId: string,
): Promise<PopulatedTicket | null> => {
  const ticket = await TicketModel.findOneAndUpdate(
    {
      _id: ticketId,
      status: "open",
    },
    {
      $set: {
        status: "in_progress",
        assignedTo: adminId,
      },
    },
    {
      new: true,
    },
  )
    .populate("user", "name email avatar")
    .populate("assignedTo", "name email avatar")
    .lean();

  return ticket as PopulatedTicket | null;
};

type ListTicketsOptions = {
  page: number;
  limit: number;
  status?: TicketStatus;
};

export const listTickets = async ({
  page,
  limit,
  status,
}: ListTicketsOptions) => {
  const filter: {
    status?: TicketStatus;
  } = {};

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [tickets, total, allTotal] = await Promise.all([
    TicketModel.find(filter)
      .populate("user", "name email avatar")
      .populate("assignedTo", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    TicketModel.countDocuments(filter),

    TicketModel.countDocuments(),
  ]);

  return {
    tickets,
    total,
    totalPages: Math.ceil(total / limit),
    allTotal,
    page,
    limit,
  };
};

export const listAssignedTickets = async ({
  adminId,
  page,
  limit,
  status,
}: ListTicketsOptions & { adminId: string }) => {
  const filter: {
    assignedTo: string;
    status?: TicketStatus;
  } = { assignedTo: adminId };

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [tickets, total, allTotal] = await Promise.all([
    TicketModel.find(filter)
      .populate("user", "name email avatar")
      .populate("assignedTo", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    TicketModel.countDocuments(filter),

    TicketModel.countDocuments({ assignedTo: adminId }),
  ]);

  return {
    tickets,
    total,
    totalPages: Math.ceil(total / limit),
    allTotal,
    page,
    limit,
  };
};

export const listMyTickets = async ({
  userId,
  page,
  limit,
  status,
}: ListTicketsOptions & { userId: string }) => {
  const filter: {
    user: string;
    status?: TicketStatus;
  } = { user: userId };

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [tickets, total, allTotal] = await Promise.all([
    TicketModel.find(filter)
      .populate("user", "name email avatar")
      .populate("assignedTo", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    TicketModel.countDocuments(filter),

    TicketModel.countDocuments({ user: userId }),
  ]);

  return {
    tickets,
    total,
    totalPages: Math.ceil(total / limit),
    allTotal,
    page,
    limit,
  };
};

export const closeTicket = async (
  ticketId: string,
): Promise<PopulatedTicket | null> => {
  const ticket = await TicketModel.findOneAndUpdate(
    {
      _id: ticketId,
    },
    {
      $set: {
        status: "closed",
      },
    },
    {
      new: true,
    },
  )
    .populate("user", "name email avatar")
    .populate("assignedTo", "name email avatar")
    .lean();

  return ticket as PopulatedTicket | null;
};