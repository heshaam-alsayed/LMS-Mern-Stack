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

export const getMonthlyAnalytics = async (model: Model<any>, year?: number) => {
  const targetYear = year || new Date().getFullYear();

  const start = new Date(targetYear, 0, 1);
  const end = new Date(targetYear, 11, 31, 23, 59, 59, 999);

  const rawData = await model.aggregate([
    {
      $match: {
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

  const formatted = formatMonthly(rawData);

  const allZero = formatted.every((item) => item.count === 0);

  if (allZero) {
    return [];
  }

  return formatted;
};
