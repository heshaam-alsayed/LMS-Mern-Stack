import { NextFunction, Request, Response } from "express";
import notificationService from "../services/notification.service";

// get all notifications for admin
export const getAllNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await notificationService.getAllNotifications(req.query);
    res.status(200).json({
      success: true,
      result: result.notifications.length,
      notifications: result.notifications,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNotification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const notificationId = req.params.id.toString();
    const data = req.body;
    const notifications = await notificationService.updateNotification(
      notificationId,
      data,
    );
    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};
