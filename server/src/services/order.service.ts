import { Types } from "mongoose";
import { IOrder, IOrderData } from "../interfaces/orderInterface";
import { IUser } from "../interfaces/userInterface";
import AppError from "../utils/AppError";
import courseRepository from "../repositories/course.repository";
import orderRepository from "../repositories/order.repository";
import sendEmail from "../utils/SendEmail";
import notificationRepository from "../repositories/notification.repository";
import UserModel from "../models/user.model";

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

export const getOrders = async () => {
  return await orderRepository.getOrders();
};
const orderService = { createOrder , getOrders };
export default orderService;
