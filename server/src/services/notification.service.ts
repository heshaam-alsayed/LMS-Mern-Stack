import { ICreateNotification } from "../interfaces/notificationInterface";
import notificationRepository from "../repositories/notification.repository";
import AppError from "../utils/AppError";

export const getAllNotifications = async (queryString: any) => {
  const result = await notificationRepository.getAllNotifications(queryString);
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
) => {
  if (!notificationId) {
    throw new AppError("Notification id is required", 400);
  }

  const existingNotification =
    await notificationRepository.getNotificationById(notificationId);

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

const notificationService = {
  getAllNotifications,
  createNotification,
  getNotificationById,
  updateNotification,
};
export default notificationService;
