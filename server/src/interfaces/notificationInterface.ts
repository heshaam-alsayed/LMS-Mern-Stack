import { Document, Types } from "mongoose";

export interface INotification {
  _id?: Types.ObjectId;

  title: string;
  message: string;

  status: "unread" | "read";

  // User who triggered the notification
  user: Types.ObjectId;

  // Account that should receive this notification
  recipient?: Types.ObjectId | null;

  organization?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateNotification {
  title: string;
  message: string;
  status?: "unread" | "read";
  user: Types.ObjectId | string;
  recipient?: Types.ObjectId | string;
  organization?: Types.ObjectId | string;
}
