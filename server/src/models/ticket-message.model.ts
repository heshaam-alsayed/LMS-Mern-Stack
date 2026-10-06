import mongoose, { Document } from "mongoose";
import { Schema } from "mongoose";

export interface ITicketAttachment {
  url: string;
  publicId: string;
  name: string;
  type: string;
  size: number;
  resourceType?: "image" | "raw";
}

export interface ITicketMessage extends Document {
  ticket: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  message?: string;
  attachments: ITicketAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

const ticketAttachmentSchema = new Schema<ITicketAttachment>(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    // Cloudinary stores "image" and "raw" assets separately, so deletions
    // need to know which one this is. Kept optional for older documents.
    resourceType: {
      type: String,
      enum: ["image", "raw"],
      required: false,
    },
  },
  {
    _id: false,
  },
);

const ticketMessageSchema = new Schema<ITicketMessage>(
  {
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      index: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 5000, 
    },

    attachments: {
      type: [ticketAttachmentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const TicketMessageModel = mongoose.model<ITicketMessage>(
  "TicketMessage",
  ticketMessageSchema,
);
export default TicketMessageModel