import { Document, Types } from "mongoose";

export interface IOrder extends Document {
  user: Types.ObjectId;
  course: Types.ObjectId;
  paymentInfo: object;
}

export interface ICreateOrder {
  user: Types.ObjectId;
  course: Types.ObjectId;
  paymentInfo: object;
}

export interface IOrderData {
    courseId: string;
    paymentInfo: object;
}