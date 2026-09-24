import { Document, Types } from "mongoose";

export interface IOrder extends Document {
  user: Types.ObjectId;
  course: Types.ObjectId; 
  organization: Types.ObjectId;
  price: number;
  paymentInfo: object;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateOrder {
  user: Types.ObjectId;
  course: Types.ObjectId;
  price: number;
  paymentInfo: object;
}

export interface IOrderData {
  courseId: string;
  paymentInfo: object;
}
