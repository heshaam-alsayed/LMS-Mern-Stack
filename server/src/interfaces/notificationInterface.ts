import { Document, Types } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  status?: string;
  user: Types.ObjectId;
}


export interface ICreateNotification {
  title: string;
  message: string;
  status?: string;
  user: Types.ObjectId;
}