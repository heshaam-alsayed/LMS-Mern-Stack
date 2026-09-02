import { NextFunction, Request, Response } from "express";
import { IOrderData } from "../interfaces/orderInterface";
import orderService from "../services/order.service";
import { IUser } from "../interfaces/userInterface";
import { getMonthlyAnalytics } from "../utils/analytics";
import OrderModel from "../models/order.model";
import UserModel from "../models/user.model";
import ApiFeatures from "../utils/apiFeatures";
import CourseModel from "../models/course.model";

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
    const isTransactions = req.query.transactions === "true";
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    let orderQuery = OrderModel.find()
      .populate("user", "name email avatar")
      .populate({
        path: "course",
        select: "name estimatePrice price thumbnail purchased category",
        populate: {
          path: "category",
          select: "title",
        },
      });
    

    // Search by user name OR course name
    if (search) {
      const [users, courses] = await Promise.all([
        UserModel.find({
          name: {
            $regex: search,
            $options: "i",
          },
        }).select("_id"),

        CourseModel.find({
          name: {
            $regex: search,
            $options: "i",
          },
        }).select("_id"),
      ]);

      const userIds = users.map((user: any) => user._id);
      const courseIds = courses.map((course: any) => course._id);

      orderQuery = OrderModel.find({
        $or: [
          {
            user: {
              $in: userIds,
            },
          },
          {
            course: {
              $in: courseIds,
            },
          },
        ],
      })
        .populate("user", "name email avatar")
        .populate("course", "name estimatePrice price thumbnail purchased");
    }

    const features = new ApiFeatures(orderQuery, req.query).sort([
      "price",
      "createdAt",
    ]);

    // Latest 5 transactions
    if (isTransactions) {
      const orders = await features.query.sort("-createdAt").limit(5);

      return res.status(200).json({
        success: true,
        result: orders.length,
        orders,
      });
    }

    // Total before pagination
    const total = await features.query.clone().countDocuments();

    // Pagination
    features.paginate();

    const orders = await features.query;

    const pagination = features.getPagination(total);

    res.status(200).json({
      success: true,
      result: orders.length,
      pagination,
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

export const getOrdersStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { year } = req.query;

    const currentYear = year ? Number(year) : new Date().getFullYear();

    if (
      !Number.isInteger(currentYear) ||
      currentYear < 2000 ||
      currentYear > 2100
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid year",
      });
    }

    const startOfYear = new Date(currentYear, 0, 1);
    const startOfNextYear = new Date(currentYear + 1, 0, 1);

    const [totalOrders, newOrders, totalRevenueResult, yearlyRevenueResult] =
      await Promise.all([
        // 1. Total Orders - All time
        OrderModel.countDocuments(),

        // 2. New Orders - Selected year
        OrderModel.countDocuments({
          createdAt: {
            $gte: startOfYear,
            $lt: startOfNextYear,
          },
        }),

        // 3. Total Revenue - All time
        OrderModel.aggregate([
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: "$price",
              },
            },
          },
        ]),

        // 4. Yearly Revenue - Selected year
        OrderModel.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfYear,
                $lt: startOfNextYear,
              },
            },
          },
          {
            $group: {
              _id: null,
              yearlyRevenue: {
                $sum: "$price",
              },
            },
          },
        ]),
      ]);

    const totalRevenue = totalRevenueResult[0]?.totalRevenue ?? 0;

    const yearlyRevenue = yearlyRevenueResult[0]?.yearlyRevenue ?? 0;

    return res.status(200).json({
      success: true,
      data: {
        totalOrders,
        newOrders,
        totalRevenue,
        yearlyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrdersMonthlyAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const year = Number(req.query.year);
    const data = await orderService.getOrdersMonthlyAnalytics(year);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyGrowthAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await orderService.getMonthlyGrowthAnalytics();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
