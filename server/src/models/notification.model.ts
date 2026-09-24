import mongoose, { Model } from "mongoose";
import { INotification } from "../interfaces/notificationInterface";

const notificationSchema = new mongoose.Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["unread", "read"],
      default: "unread",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const NotificationModel: Model<INotification> = mongoose.model(
  "Notification",
  notificationSchema,
);
export default NotificationModel;
