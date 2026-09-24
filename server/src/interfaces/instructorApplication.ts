import { Types } from "mongoose";

export type InstructorApplicationStatus = "pending" | "approved" | "rejected";
export interface IInstructorApplication {
  _id?: Types.ObjectId;

  user: Types.ObjectId;

  organizationName: string;
  organizationDescription?: string;

  status: InstructorApplicationStatus;

  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;

  rejectionReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApplicationData {
  user: Types.ObjectId;
  organizationName: string;
  organizationDescription?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}
export interface CreateNotificationData {
  title: string;
  message: string;
  user: Types.ObjectId;
  organization?: Types.ObjectId;
}
export interface CreateInstructorApplicationRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;

  organizationName: string;
  organizationDescription?: string;
}

export type GetApplicationsParams = {
  page: number;
  limit: number;
  status?: "pending" | "approved" | "rejected";
};
