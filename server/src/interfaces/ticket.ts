import mongoose from "mongoose";

export type TicketUser = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  avatar?: string;
};

export type PopulatedTicket = {
  _id: mongoose.Types.ObjectId;
  user: TicketUser;
  assignedTo: TicketUser | null;
  subject: string;
  category: string;
  status: "open" | "in_progress" | "closed";
};