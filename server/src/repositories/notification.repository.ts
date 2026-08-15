import { ICreateNotification } from "../interfaces/notificationInterface";
import NotificationModel from "../models/notification.model";

export const createNotification = async (data: ICreateNotification) => {
  return await NotificationModel.create(data);
};

export const getAllNotifications = async (filter = {}) => {
  return await NotificationModel.find(filter).sort({ createdAt: -1 });
};

export const getNotificationById = async (notificationId: string) => {
  return await NotificationModel.findById(notificationId);
};

export const updateNotification = async (notificationId: string, data: any) => {
  return await NotificationModel.findByIdAndUpdate(notificationId, data, {
    new: true,
  });
};
const notificationRepository = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
};
export default notificationRepository;
