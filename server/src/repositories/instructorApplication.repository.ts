import { Types } from "mongoose";
import {
  CreateApplicationData,
  CreateUserData,
  GetApplicationsParams,
} from "../interfaces/instructorApplication";
import InstructorApplicationModel from "../models/instructorApplication.model";
import UserModel from "../models/user.model";

export const findPendingApplicationByEmail = async (email: string) => {
  return InstructorApplicationModel.findOne({
    email,
    status: "pending",
  });
};

export const createUser = async (data: CreateUserData) => {
  return UserModel.create({
    name: data.name,
    email: data.email,
    password: data.password,
    role: "user",
    status: "pending",
  });
};

export const findPendingApplicationByUser = async (userId: string) => {
  return InstructorApplicationModel.findOne({
    user: userId,
    status: "pending",
  });
};

export const findApplicationByUserId = async (userId: string) => {
  return InstructorApplicationModel.findOne({
    user: userId,
  })
    .populate("user", "name email")
    .populate("reviewedBy", "name email");
};

export const createInstructorApplication = async (
  data: CreateApplicationData,
) => {
  const { organizationName, organizationDescription, user } = data;
  return InstructorApplicationModel.create({
    user,
    organizationName,
    organizationDescription,
    status: "pending",
  });
};

export const findAllApplications = async ({
  page,
  limit,
  status,
}: GetApplicationsParams) => {
  const filter = status ? { status } : {};
  const skip = (page - 1) * limit;

  const [applications, totalApplications] = await Promise.all([
    InstructorApplicationModel.find(filter)
      .populate("user", "name email avatar status role")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    InstructorApplicationModel.countDocuments(filter),
  ]);
  return {
    applications,
    totalApplications,
  };
};

export const getApplicationById = async (id: string) => {
  return InstructorApplicationModel.findById(id)
    .populate("user")
    .populate("reviewedBy");
};

export const getApplicationByIdForUpdate = async (id: string) => {
  return InstructorApplicationModel.findById(id)
};
export const updateInstructorApplication = async (id: string, data: any) => {
  return InstructorApplicationModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};
