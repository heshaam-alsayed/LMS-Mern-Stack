import { isValidObjectId } from "mongoose";
import {
  CreateApplicationData,
  CreateInstructorApplicationRequest,
} from "../interfaces/instructorApplication";
import {
  createInstructorApplication,
  createUser,
  findAllApplications,
  findApplicationByUserId,
  findPendingApplicationByEmail,
  findPendingApplicationByUser,
  getApplicationById,
  getApplicationByIdForUpdate,
  updateInstructorApplication,
} from "../repositories/instructorApplication.repository";
import { createNotification } from "../repositories/notification.repository";
import userRepository, {
  getUserByEmail,
} from "../repositories/user.repository";
import { getIO } from "../socketServer";
import AppError from "../utils/AppError";
import UserModel from "../models/user.model";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

type GetApplicationsParams = {
  page?: string;
  limit?: string;
  status?: string;
};

type ApplicationStatus = "pending" | "approved" | "rejected";

const VALID_STATUSES = ["pending", "approved", "rejected"];
export const createInstructorApplicationService = async (
  data: CreateInstructorApplicationRequest,
) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    organizationName,
    organizationDescription,
  } = data;

  if (!name || !email || !password || !confirmPassword || !organizationName) {
    throw new AppError(
      "Name, email, password and organization name are required",
      400,
    );
  }

  if (password !== confirmPassword) {
    throw new AppError("Password and confirm password do not match", 400);
  }

  if (!passwordRegex.test(password)) {
    throw new AppError(
      "Password must be at least 6 characters and contain an uppercase letter, a lowercase letter and a number",
      400,
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await getUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const newUser = await createUser({
    name,
    email: normalizedEmail,
    password,
  });
  const existingPendingApplication = await findPendingApplicationByUser(
    newUser._id.toString(),
  );

  if (existingPendingApplication) {
    throw new AppError(
      "You already have a pending organization application",
      409,
    );
  }

  const application = await createInstructorApplication({
    user: newUser._id,
    organizationName,
    organizationDescription,
  });

  const notification = await createNotification({
    title: "New Organization Application",
    message: `${name} submitted a request to create ${organizationName}.`,
    user: newUser._id,
  });

  const io = getIO();

  io.to("admins").emit("notification", notification);

  return application;
};

export const getOrganizationApplicationByEmail = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new AppError("Email is required", 400);
  }

  // 1. Find user by email
  const user = await userRepository.findUserByEmail(normalizedEmail);

  if (!user) {
    throw new AppError(
      "No Organization found with this User email address",
      404,
    );
  }

  // 2 Find organization application by user ID
  const application = await findApplicationByUserId(user._id.toString());

  if (!application) {
    throw new AppError(
      "No organization application found for this email address",
      404,
    );
  }

  return application;
};

export const getAllOrganizationApplicationsService = async ({
  page = "1",
  limit = "10",
  status,
}: GetApplicationsParams) => {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  const finalLimit = Math.min(parsedLimit, 50);
  if (
    !Number.isInteger(parsedPage) ||
    parsedPage < 1 ||
    !Number.isInteger(finalLimit) ||
    finalLimit < 1
  ) {
    throw new AppError("Invalid pagination parameters", 400);
  }
  if (status && !VALID_STATUSES.includes(status as ApplicationStatus)) {
    throw new AppError("Invalid application status", 400);
  }
  const { applications, totalApplications } = await findAllApplications({
    page: parsedPage,
    limit: finalLimit,
    status: status as ApplicationStatus | undefined,
  });

  const totalPages = Math.ceil(totalApplications / finalLimit);
  const hasNextPage = parsedPage * finalLimit < totalPages;
  const hasPreviousPage = parsedPage > 1;

  return {
    applications,
    pagination: {
      totalApplications,
      currentPage: parsedPage,
      limit: finalLimit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
  };
};

export const getOrganizationApplicationById = async (id: string) => {
  if (!id) {
    throw new AppError("Organization application ID is required", 400);
  }
  if (!isValidObjectId(id)) {
    throw new AppError("Invalid organization application ID", 400);
  }

  const application = await getApplicationById(id);

  if (!application) {
    throw new AppError("Organization application not found", 404);
  }

  return application;
};

export const approveInstructorApplicationService = async (
  applicationId: string,
  adminId: string,
) => {
  if (!isValidObjectId(applicationId)) {
    throw new AppError("Invalid instructor application ID", 400);
  }

  if (!isValidObjectId(adminId)) {
    throw new AppError("Invalid admin ID", 400);
  }
  // get application
  const application = await getApplicationByIdForUpdate(applicationId);

  if (!application) {
    throw new AppError("Instructor application not found", 404);
  }
  if (application.status !== "pending") {
    throw new AppError(`Application is already ${application.status}`, 400);
  }
  const user = await UserModel.findById(application.user);
  if (!user) {
    throw new AppError("Applicant user not found", 404);
  }

  user.role = "instructor";
  user.status = "active";
  await user.save();

  await updateInstructorApplication(applicationId, {
    status: "approved",
    reviewedBy: adminId,
    reviewedAt: new Date(),
    rejectionReason: null,
  });

  const updatedApplication = await getApplicationById(applicationId);

  return updatedApplication;
};

export const rejectInstructorApplicationService = async (
  applicationId: string,
  adminId: string,
  rejectionReason: string,
) => {
  if (!isValidObjectId(applicationId)) {
    throw new AppError("Invalid instructor application ID", 400);
  }

  if (!isValidObjectId(adminId)) {
    throw new AppError("Invalid admin ID", 400);
  }
  const reason = rejectionReason?.trim();

  if (!reason) {
    throw new AppError("Rejection reason is required", 400);
  }

  const application = await getApplicationByIdForUpdate(applicationId);
  if (!application) {
    throw new AppError("Instructor application not found", 404);
  }
  if (application.status !== "pending") {
    throw new AppError(`Application is already ${application.status}`, 400);
  }
  await updateInstructorApplication(applicationId, {
    status: "rejected",
    reviewedBy: adminId,
    reviewedAt: new Date(),
    rejectionReason: reason,
  });

  const updatedApplication = await getApplicationById(applicationId); // get updated application

  return updatedApplication;
};
