import { Model } from "mongoose";
import UserModel from "../models/user.model";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatMonthly = (data: any[]) => {
  const result = Array.from({ length: 12 }, (_, i) => ({
    month: MONTHS[i],
    count: 0,
  }));

  data.forEach((item) => {
    const monthIndex = item._id.month - 1;
    result[monthIndex].count = item.count;
  });

  return result;
};

export const getMonthlyAnalytics = async (
  model: Model<any>,
  year?: number,
  filter?: Record<string, any>,
) => {
  const targetYear = year || new Date().getFullYear();

  const start = new Date(Date.UTC(targetYear, 0, 1));
  const end = new Date(Date.UTC(targetYear, 11, 31, 23, 59, 59, 999));

  const rawData = await model.aggregate([
    {
      $match: {
        ...(filter || {}),
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.month": 1 },
    },
  ]);

  return formatMonthly(rawData);
};
