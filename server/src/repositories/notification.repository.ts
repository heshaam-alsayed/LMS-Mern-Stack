import { ICreateNotification } from "../interfaces/notificationInterface";
import NotificationModel from "../models/notification.model";
import ApiFeatures from "../utils/apiFeatures";

export const createNotification = async (data: ICreateNotification) => {
  const payload = {
    ...data,
    status: data.status ?? "unread",
  };

  return await NotificationModel.create(payload);
};

export const getAllNotifications = async (
  queryString: any,
  recipientId?: string,
) => {
  const query = recipientId
    ? NotificationModel.find({ recipient: recipientId })
    : NotificationModel.find();

  const features = new ApiFeatures(query, queryString);
  features.filter(["status"]).sort(["-createdAt"]);
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

export const getNotificationById = async (
  notificationId: string,
  recipientId?: string,
) => {
  const filter: Record<string, any> = { _id: notificationId };

  if (recipientId) {
    filter.recipient = recipientId;
  }

  return await NotificationModel.findOne(filter);
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
