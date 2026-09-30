import { Types } from "mongoose";

import { ICreateNotification } from "../interfaces/notificationInterface";
import notificationRepository from "../repositories/notification.repository";
import OrganizationModel from "../models/organization.model";
import { getIO } from "../socketServer";
import AppError from "../utils/AppError";

export const getAllNotifications = async (
  queryString: any,
  currentUser?: { _id: string; role: string },
) => {
  // instructors only see notifications addressed to them
  const recipientId =
    currentUser?.role === "instructor" ? currentUser._id : undefined;

  const result = await notificationRepository.getAllNotifications(
    queryString,
    recipientId,
  );
  return result;
};
export const createNotification = async (data: ICreateNotification) => {
  if (!data) throw new AppError(" notification data is required", 400);
  const notification = await notificationRepository.createNotification(data);
  return notification;
};

export const getNotificationById = async (notificationId: string) => {
  if (!notificationId) {
    throw new AppError("Notification id is required", 400);
  }
  const notification =
    await notificationRepository.getNotificationById(notificationId);
  if (!notification) throw new AppError("Notification not found", 404);
  return notification;
};
export const updateNotification = async (
  notificationId: string,
  filterData: any,
  currentUser?: { _id: string; role: string },
) => {
  if (!notificationId) {
    throw new AppError("Notification id is required", 400);
  }

  // instructors may only touch their own notifications
  const recipientId =
    currentUser?.role === "instructor" ? currentUser._id : undefined;

  const existingNotification =
    await notificationRepository.getNotificationById(
      notificationId,
      recipientId,
    );

  if (!existingNotification) {
    throw new AppError("Notification not found", 404);
  }

  if (existingNotification.status === "read") {
    return existingNotification;
  }

  const notification = await notificationRepository.updateNotification(
    notificationId,
    filterData,
  );
  return notification;
};

// Sends a real-time "notification" event to that instructor socket room.

export const notifyCourseInstructor = async (options: {
  organizationId?: Types.ObjectId | string | null;
  actor: { _id: Types.ObjectId | string; name?: string };
  title: string;
  message: string;
}) => {
  const { organizationId, actor, title, message } = options;

  if (!organizationId || !Types.ObjectId.isValid(String(organizationId))) {
    return null;
  }

  const organization = await OrganizationModel.findById(organizationId)
    .select("instructor")
    .lean();

  const instructorId = organization?.instructor;

  if (!instructorId) {
    return null;
  }

  const notification = await notificationRepository.createNotification({
    title,
    message,
    user: actor._id,
    recipient: instructorId,
    organization: organization._id,
  });

  // a socket failure must not fail the action that triggered it
  try {
    getIO().to(`instructor:${instructorId}`).emit("notification", notification);
  } catch {
    // sockets are not available in scripts and tests
  }

  return notification;
};

const notificationService = {
  getAllNotifications,
  createNotification,
  getNotificationById,
  updateNotification,
  notifyCourseInstructor,
};
export default notificationService;
