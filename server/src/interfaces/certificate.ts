import { Types } from "mongoose";

export interface ICertificate {
  certificateId: string;

  user: Types.ObjectId;

  course: Types.ObjectId;
  organization: Types.ObjectId;
  studentName: string;

  courseTitle: string;
  learningHours: number;
  issuedAt: Date;

  createdAt?: Date;

  updatedAt?: Date;
}
