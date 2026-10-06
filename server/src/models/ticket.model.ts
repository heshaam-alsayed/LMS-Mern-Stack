import mongoose, { Model } from "mongoose";
import { Schema } from "mongoose";
import { Document } from "mongoose";

export type TicketStatus = "open" | "in_progress" | "closed";

export type TicketCategory =
  | "payment"
  | "course"
  | "video"
  | "account"
  | "certificate"
  | "other";

export interface ITicket extends Document {
  user: mongoose.Types.ObjectId;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  assignedTo: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    category: {
      type: String,
      enum: ["payment", "course", "video", "account", "certificate", "other"],
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "closed"],
      default: "open",
      index: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const TicketModel = mongoose.model<ITicket>("Ticket", ticketSchema);

export default TicketModel;
