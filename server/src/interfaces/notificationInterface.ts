import { Document, Types } from "mongoose";

export interface INotification {
  _id?: Types.ObjectId;

  title: string;
  message: string;

  status: "unread" | "read";

  // User who triggered the notification
  user: Types.ObjectId;

  // Organization is optional because it may not exist yet
  organization?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateNotification {
  title: string;
  message: string;
  status?: string;
  user: Types.ObjectId;
}
