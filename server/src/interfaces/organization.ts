import { Types } from "mongoose";

export interface IOrganization {
  name: string;
  slug: string;
  description?: string;
  instructor: Types.ObjectId;
  status: "active" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}