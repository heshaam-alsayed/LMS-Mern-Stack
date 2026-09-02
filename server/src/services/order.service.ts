import { Types } from "mongoose";
import { IOrder, IOrderData } from "../interfaces/orderInterface";
import { IUser } from "../interfaces/userInterface";
import AppError from "../utils/AppError";
import courseRepository from "../repositories/course.repository";
import orderRepository from "../repositories/order.repository";
import sendEmail from "../utils/SendEmail";
import notificationRepository from "../repositories/notification.repository";
import UserModel from "../models/user.model";
import OrderModel from "../models/order.model";
import CourseModel from "../models/course.model";

export const createOrder = async (
  orderData: IOrderData,
  coursesUserList: Types.ObjectId[],
  userData: IUser,
) => {
  const { courseId, paymentInfo } = orderData;

  if (!paymentInfo) {
    throw new AppError("Payment info is required", 400);
  }

  const userFromDb = await UserModel.findById(userData._id).select("courses");

  const alreadyPurchased = userFromDb?.courses?.some(
    (id) => id.toString() === courseId.toString(),
  );

  if (alreadyPurchased) {
    throw new AppError("You have already purchased this course", 400);
  }

  const course = await courseRepository.getFullCourseById(courseId.toString());

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const order = await orderRepository.createOrder({
    user: userData._id,
    course: course._id,
    paymentInfo,
  });

  await sendEmail({
    email: userData.email,
    subject: "Course Enrollment Confirmation",
    template: "order-confirmation.ejs",
    data: {
      name: userData.name,
      courseName: course.name,
      orderId: order._id.toString(),
      courseUrl: `${process.env.CLIENT_URL}/course/${course._id}`,
    },
  });

  await UserModel.findByIdAndUpdate(userData._id, {
    $addToSet: {
      courses: course._id,
    },
  });

  await notificationRepository.createNotification({
    title: "New Order Received",
    message: `${userData.name} purchased "${course.name}"`,
    user: userData._id,
  });

  if (course.purchased) {
    course.purchased = course.purchased + 1;
  }

  await course.save({
    validateBeforeSave: false,
  });

  return order;
};

export const getOrders = async (transactions = false) => {
  return await orderRepository.getOrders(transactions);
};

export const getOrdersMonthlyAnalytics = async (year: number) => {
  if (!year || !Number.isInteger(year)) {
    throw new AppError("A valid year is required", 400);
  }

  const startOfYear = new Date(year, 0, 1);
  const startOfNextYear = new Date(year + 1, 0, 1);

  const result = await OrderModel.aggregate([
    {
      $facet: {
        yearlyRevenue: [
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
              totalRevenue: {
                $sum: "$price",
              },
            },
          },
        ],

        allTimeRevenue: [
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: "$price",
              },
            },
          },
        ],

        monthly: [
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
              _id: {
                month: {
                  $month: "$createdAt",
                },
              },
              orders: {
                $sum: 1,
              },
              revenue: {
                $sum: "$price",
              },
            },
          },
          {
            $sort: {
              "_id.month": 1,
            },
          },
        ],
      },
    },
  ]);

  const yearlyRevenue = result[0]?.yearlyRevenue?.[0]?.totalRevenue ?? 0;

  const allTimeRevenue = result[0]?.allTimeRevenue?.[0]?.totalRevenue ?? 0;

  const monthlyData = result[0]?.monthly ?? [];

  const monthly = Array.from({ length: 12 }, (_, index) => {
    const monthNumber = index + 1;

    const monthData = monthlyData.find(
      (item: { _id: { month: number } }) => item._id.month === monthNumber,
    );

    return {
      month: new Date(year, index, 1).toLocaleString("en-US", {
        month: "long",
      }),
      orders: monthData?.orders ?? 0,
      revenue: monthData?.revenue ?? 0,
    };
  });

  return {
    yearlyRevenue,
    allTimeRevenue,
    monthly,
  };
};

export const getMonthlyGrowthAnalytics = async () => {
  const now = new Date();

  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const startOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
  );

  const [
    currentUsers,
    previousUsers,
    currentCourses,
    previousCourses,
    currentOrders,
    previousOrders,
  ] = await Promise.all([
    UserModel.countDocuments({
      createdAt: {
        $gte: startOfCurrentMonth,
        $lt: startOfNextMonth,
      },
    }),

    UserModel.countDocuments({
      createdAt: {
        $gte: startOfPreviousMonth,
        $lt: startOfCurrentMonth,
      },
    }),

    CourseModel.countDocuments({
      createdAt: {
        $gte: startOfCurrentMonth,
        $lt: startOfNextMonth,
      },
    }),

    CourseModel.countDocuments({
      createdAt: {
        $gte: startOfPreviousMonth,
        $lt: startOfCurrentMonth,
      },
    }),

    OrderModel.countDocuments({
      createdAt: {
        $gte: startOfCurrentMonth,
        $lt: startOfNextMonth,
      },
    }),

    OrderModel.countDocuments({
      createdAt: {
        $gte: startOfPreviousMonth,
        $lt: startOfCurrentMonth,
      },
    }),
  ]);

  const calculatePercentage = (current: number, previous: number): number => {
    if (previous === 0) {
      return current === 0 ? 0 : 100;
    }

    return Number((((current - previous) / previous) * 100).toFixed(2));
  };

  const getTrend = (percentage: number) => {
    if (percentage > 0) {
      return "up";
    }

    if (percentage < 0) {
      return "down";
    }

    return "same";
  };

  const usersPercentage = calculatePercentage(currentUsers, previousUsers);

  const coursesPercentage = calculatePercentage(
    currentCourses,
    previousCourses,
  );

  const ordersPercentage = calculatePercentage(currentOrders, previousOrders);

  return {
    users: {
      current: currentUsers,
      previous: previousUsers,
      percentage: usersPercentage,
      trend: getTrend(usersPercentage),
    },

    courses: {
      current: currentCourses,
      previous: previousCourses,
      percentage: coursesPercentage,
      trend: getTrend(coursesPercentage),
    },

    orders: {
      current: currentOrders,
      previous: previousOrders,
      percentage: ordersPercentage,
      trend: getTrend(ordersPercentage),
    },
  };
};
const orderService = {
  createOrder,
  getOrders,
  getOrdersMonthlyAnalytics,
  getMonthlyGrowthAnalytics,
};
export default orderService;
