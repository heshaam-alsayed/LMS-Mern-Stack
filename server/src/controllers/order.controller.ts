import { NextFunction, Request, Response } from "express";
import { IOrderData } from "../interfaces/orderInterface";
import orderService from "../services/order.service";
import { IUser } from "../interfaces/userInterface";
import { getMonthlyAnalytics } from "../utils/analytics";
import OrderModel from "../models/order.model";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;
    const coursersUserList = req.user?.courses || [];
    const user: IUser = req.user as IUser;
    const order = await orderService.createOrder(data, coursersUserList, user);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orders = await orderService.getOrders();
    res.status(200).json({
      success: true,
      result: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyOrdersAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const year = req.query.year ? Number(req.query.year) : undefined;

    const data = await getMonthlyAnalytics(OrderModel, year);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
