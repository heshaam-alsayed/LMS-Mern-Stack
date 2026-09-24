import { ICreateNotification } from "../interfaces/notificationInterface";
import NotificationModel from "../models/notification.model";
import ApiFeatures from "../utils/apiFeatures";

export const createNotification = async (data: ICreateNotification) => {
  return await NotificationModel.create(data);
};

export const getAllNotifications = async (queryString: any) => {
  const query = NotificationModel.find();
  const features = new ApiFeatures(query, queryString);
  features.filter(["status"]).sort(["createdAt"]);
  // Use a clone for count
  const total = await features.query.clone().countDocuments();
  features.paginate();

  // Execute the original query
  const notifications = await features.query;

  const pagination = features.getPagination(total);

  return {
    notifications,
    pagination,
  };
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
