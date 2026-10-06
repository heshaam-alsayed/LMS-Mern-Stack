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
import { stripe } from "../config/stripe";
import redis, {
  delCached,
  sanitizeUser,
  sessionKey,
  setCached,
  userPublicKey,
} from "../utils/redis";
import { bumpCatalogGeneration } from "../utils/courseCache";
import {
  invalidateOrgCachesByInstructor,
  invalidateOrgCourseOrdersCache,
  invalidateOrgDataCaches,
} from "./organization.service";
import Stripe from "stripe";
import { initializeCourseProgress } from "./courseProgress.service";
import { notifyCourseInstructor } from "./notification.service";
import { getIO } from "../socketServer";

export const createOrder = async (
  userId: string,
  courseId: string,
  paymentIntent: Stripe.PaymentIntent,
) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  if (!Types.ObjectId.isValid(courseId)) {
    throw new AppError("Invalid course ID", 400);
  }

  if (!paymentIntent?.id) {
    throw new AppError("Payment intent is required", 400);
  }

  // Prevent duplicate order
  const existingOrder = await OrderModel.findOne({
    "paymentInfo.id": paymentIntent.id,
  });

  if (existingOrder) {
    return null;
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const alreadyPurchased = user.courses?.some(
    (id) => id.toString() === courseId,
  );

  if (alreadyPurchased) {
    return null;
  }

  const course = await courseRepository.getFullCourseById(courseId);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  if (course.status !== "published") {
    throw new AppError("This course is not available for purchase", 400);
  }

  if (!course.organization) {
    throw new AppError(
      "This course is not linked to an organization yet",
      400,
    );
  }

  // Create order
  const order = await orderRepository.createOrder({
    user: user._id,
    course: course._id,
    organization: course.organization,
    price: course.price,
    paymentInfo: {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      payment_method: paymentIntent.payment_method,
      created: paymentIntent.created,
      metadata: paymentIntent.metadata,
    },
  });

  const updatedUser = await UserModel.findByIdAndUpdate(
    user._id,
    {
      $addToSet: {
        courses: course._id,
      },
    },
    {
      new: true,
    },
  );

  if (!updatedUser) {
    throw new AppError("Failed to update user", 500);
  }

  await redis.set(
    sessionKey(user._id.toString()),
    JSON.stringify(sanitizeUser(updatedUser)),
    "EX",
    7 * 24 * 60 * 60,
  );
  await delCached(userPublicKey(user._id.toString()));

  course.purchased = (course.purchased ?? 0) + 1;

  await course.save({
    validateBeforeSave: false,
  });

  // purchased counter is shown in public lists (sort=purchased, ratings),
  // orphan every cached catalog page
  await bumpCatalogGeneration();

  await invalidateOrgCachesByInstructor(String(course.instructor ?? ""));

  // dashboards/orders-summary/analytics aggregates changed with this order;
  // the org-level keys are all addressable, so drop them here, plus the
  // per-course 12-month chart for the exact course that was just sold
  await invalidateOrgDataCaches(String(course.organization ?? ""));

  await invalidateOrgCourseOrdersCache(
    String(course.organization ?? ""),
    String(course._id),
  );

  const totalLectures = course.courseData?.length ?? 0;

  await initializeCourseProgress(
    user._id.toString(),
    course._id.toString(),
    totalLectures,
    String(course.organization ?? ""),
  );
  const notificationData = {
    title: "New Order Received",
    message: `You have a new order from ${user.name}. The user purchased the course "${course.name}"`,
    user: user._id,
    organization: course.organization,
  };

  const notification =
    await notificationRepository.createNotification(notificationData);

  const io = getIO();
  // make event for admin only with create new order
  io.to("admins").emit("notification", notification);

  // send notification event to instructor who owns this course
  await notifyCourseInstructor({
    organizationId: course.organization,
    actor: { _id: user._id, name: user.name },
    title: "New Sale on Your Course",
    message: `${user.name} purchased "${course.name}".`,
  });

  await sendEmail({
    email: user.email,
    subject: "Course Enrollment Confirmation",
    template: "order-confirmation.ejs",
    data: {
      name: user.name,
      courseName: course.name,
      orderId: order._id.toString(),
      courseUrl: `${process.env.CLIENT_URL}/course/${course._id}`,
    },
  });

  return {
    order,
    notification,
  };
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
