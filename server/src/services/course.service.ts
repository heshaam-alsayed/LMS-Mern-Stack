import courseRepository from "../repositories/course.repository";
import cloudinary from "cloudinary";
import AppError from "../utils/AppError";
import redis from "../utils/redis";
import mongoose, { Types } from "mongoose";
import {
  IAddQuestionData,
  IAddReplyReviewData,
  IAddReviewData,
  IAnswerData,
} from "../interfaces/courseInterface";
import { calcAverageReviews, isValidId } from "../utils/helper";
import { IUser } from "../interfaces/userInterface";
import sendEmail from "../utils/SendEmail";
import { IOrder } from "../interfaces/orderInterface";
import notificationRepository from "../repositories/notification.repository";
import CourseModel from "../models/course.model";
import userRepository from "../repositories/user.repository";
import UserModel from "../models/user.model";
import { getIO } from "../socketServer";
import OrderModel from "../models/order.model";

export const createCourse = async (data: any) => {
  const thumbnail = data.thumbnail;
  if (thumbnail) {
    const result = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courses",
    });
    data.thumbnail = { public_Id: result.public_id, url: result.secure_url };
  }
  return await courseRepository.createCourse(data);
};

export const updateCourse = async (courseId: string, courseData: any) => {
  if (!courseId) {
    throw new AppError("Course id is required", 400);
  }

  const course = await courseRepository.getCourseById(courseId);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const thumbnail = courseData.thumbnail;

  // Check if thumbnail is a NEW image
  const isNewThumbnail =
    typeof thumbnail === "string" &&
    thumbnail.length > 0 &&
    !thumbnail.startsWith("https://res.cloudinary.com/");

  if (isNewThumbnail) {
    const oldPublicId = course.thumbnail?.public_Id;

    // Upload new thumbnail first
    const result = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courses",
    });

    // Replace thumbnail data with Cloudinary response
    courseData.thumbnail = {
      public_Id: result.public_id,
      url: result.secure_url,
    };

    // Update database first
    const updatedCourse = await courseRepository.updateCourse(
      courseId,
      courseData,
    );

    // Delete old thumbnail after successful update
    if (oldPublicId && oldPublicId !== result.public_id) {
      await cloudinary.v2.uploader.destroy(oldPublicId);
    }

    return updatedCourse;
  }

  if (
    typeof thumbnail === "string" &&
    thumbnail.startsWith("https://res.cloudinary.com/")
  ) {
    delete courseData.thumbnail;
  }

  // No new thumbnail -> keep existing thumbnail
  return await courseRepository.updateCourse(courseId, courseData);
};

// get course public not purchased
export const getPublicCourse = async (courseId: string) => {
  if (!courseId) throw new AppError("Course id is required", 400);
  const cachedCourse = await redis.get(courseId);
  if (cachedCourse) {
    return JSON.parse(cachedCourse);
  }

  const course = await courseRepository.getPublicCourse(courseId);
  if (!course) throw new AppError("Course not found", 404);

  await redis.set(courseId, JSON.stringify(course), "EX", 900);
  return course;
};

// get all courses public not purchased
// Get all public courses
export const getAllCourses = async (queryString: any) => {
  const { courses, pagination } =
    await courseRepository.getAllCourses(queryString);

  const result = {
    courses,
    pagination,
  };

  return result;
};

// get course by user for purchased
export const getCourseByUser = async (courseId: string, userId: string) => {
  if (!courseId) {
    throw new AppError("Course id is required", 400);
  }

  const hasAccess = await UserModel.exists({
    _id: userId,
    courses: courseId,
  });

  if (!hasAccess) {
    throw new AppError("You have not purchased this course", 403);
  }

  return await courseRepository.getContentCourse(courseId);
};

export const getAdminCourse = async (courseId: string) => {
  if (!courseId) throw new AppError("Course id is required", 400);
  const course = await courseRepository.getFullCourseById(courseId);
  if (!course) throw new AppError("Course id not found", 400);
  return course;
};
export const addQuestion = async (data: IAddQuestionData, userId: string) => {
  const { question, contentId, courseId } = data;
  // get course by id
  if (!isValidId(contentId) || !isValidId(courseId))
    throw new AppError("Content id or course id is invalid", 400);
  const course = await courseRepository.getFullCourseById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const user = await userRepository.getSafeUser(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // find content by id
  const courseContent = course.courseData.find(
    (item) => item._id.toString() === contentId,
  );

  if (!courseContent) {
    throw new AppError("Content not found", 404);
  }
  const questionData: any = {
    user,
    question,
    questionReplies: [],
  };

  // push question to content
  courseContent.questions.push(questionData);

  // send and create notification
  const notification = await notificationRepository.createNotification({
    user: user._id,
    title: " new question received",
    message: `${user.name} ask a question in ${courseContent?.title} lesson`,
  });

  await course?.save({
    validateBeforeSave: false,
  });
  await redis.set(courseId, JSON.stringify(course), "EX", "604800");

  const io = getIO();
  io.to("admins").emit("notification", notification);
  return course;
};

export const addAnswer = async (data: IAnswerData, userId: string) => {
  const { answer, questionId, contentId, courseId } = data;

  const course = await courseRepository.getFullCourseById(courseId);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const user = await userRepository.getSafeUser(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }
  const courseContent = course.courseData.find(
    (item) => item._id.toString() === contentId,
  );

  if (!courseContent) {
    throw new AppError("Content Id not found", 404);
  }

  const isExistQuestion = courseContent.questions.find(
    (item) => item._id.toString() === questionId,
  );

  if (!isExistQuestion) {
    throw new AppError("Question Id not found", 404);
  }

  const answerData: any = {
    user,
    answer,
  };

  isExistQuestion.questionReplies = isExistQuestion.questionReplies || [];

  isExistQuestion.questionReplies.push(answerData);

  await course.save({ validateBeforeSave: false });
  await redis.set(courseId, JSON.stringify(course), "EX", "604800");

  if (user._id.toString() === isExistQuestion.user._id.toString()) {
    // send and create notification
    await notificationRepository.createNotification({
      user: user._id,
      title: "New Reply",
      message: `You replied to your question in "${courseContent.title}".`,
    });
  } else {
    await notificationRepository.createNotification({
      user: isExistQuestion.user._id,
      title: "Question Answered",
      message: `${user.name} replied to your question in "${courseContent.title}".`,
    });
    const emailData = {
      name: isExistQuestion.user.name,
      courseTitle: course.name,
      contentTitle: courseContent.title,
      question: isExistQuestion.question,
      answer: answer,
    };

    await sendEmail({
      email: isExistQuestion.user.email,
      subject: "Question Answered",
      template: "question-reply.ejs",
      data: emailData,
    });
  }

  return course;
};

export const addReviewCourse = async (
  courseId: string,
  data: IAddReviewData,
  userId: string,
) => {
  const { review, rating } = data;

  if (rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }

  const user = await userRepository.getSafeUser(userId);
  if (!user) {
    throw new AppError("user not found", 404);
  }
  const courseExist = user.courses.some(
    (id) => id.toString() === courseId.toString(),
  );

  if (!courseExist) {
    throw new AppError("you have not purchased to access this course", 403);
  }

  const course = await courseRepository.getFullCourseById(courseId);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const alreadyReviewed = course.reviews.find(
    (review: any) => review.user._id === user._id.toString(),
  );

  if (alreadyReviewed) {
    throw new AppError("You already reviewed this course", 400);
  }

  const reviewData: any = {
    user,
    comment: review,
    rating,
  };

  course.reviews.push(reviewData);

  const averageRating = calcAverageReviews(course.reviews);
  course.ratings = averageRating;

  await course.save({ validateBeforeSave: false });
  await redis.set(courseId, JSON.stringify(course), "EX", "604800");
  const notification = await notificationRepository.createNotification({
    user: user._id,
    title: "New Review Recieved",
    message: `${user.name} has give a review in "${course.name}".`,
  });

  const io = getIO();
  io.to("admins").emit("notification", notification);

  return course;
};

export const addReplyReview = async (
  data: IAddReplyReviewData,
  userId: string,
) => {
  const { comment, reviewId, courseId } = data;

  const course = await courseRepository.getFullCourseById(courseId);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const user = await userRepository.getSafeUser(userId);

  if (!user) {
    throw new AppError("user not found", 404);
  }

  const review = course.reviews.find(
    (item: any) => item._id.toString() === reviewId.toString(),
  );

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  const replyData: any = {
    user,
    comment,
  };

  review.commentReplies = review.commentReplies || [];

  review.commentReplies.push(replyData);
  await course.save({
    validateBeforeSave: false,
  });
  await redis.set(courseId, JSON.stringify(course), "EX", "604800");

  return course;
};

export const getCourses = async () => {
  const courses = await courseRepository.getCourses();
  return courses;
};

export const getCoursePurchases = async (courseId: string) => {
  const course = await CourseModel.findById(courseId).select("name purchased");

  if (!course) {
    throw new Error("Course not found");
  }

  return {
    courseId: course._id,
    name: course.name,
    purchased: course.purchased,
  };
};

export const getAllCoursesPurchases = async () => {
  const courses = await CourseModel.find().select("name purchased");

  return courses.map((course) => ({
    courseId: course._id,
    name: course.name,
    purchased: course.purchased,
  }));
};
export const getTopSellingCourses = async (limit?: number) => {
  const finalLimit = Math.min(limit || 10, 10);

  return await CourseModel.find({
    purchased: { $gt: 0 },
  })
    .sort({ purchased: -1 })
    .limit(finalLimit)
    .select("name purchased price")
    .lean();
};

export const getOperationCourse = async (courseId: string) => {
  if (!courseId) {
    throw new AppError("Course ID is required", 400);
  }

  if (!Types.ObjectId.isValid(courseId)) {
    throw new AppError("Invalid course ID", 400);
  }

  const course = await CourseModel.findById(courseId)
    .select(
      "name description price category estimatePrice thumbnail level reviews ratings purchased",
    )
    .populate("category", "slug title");
  if (!course) {
    throw new AppError("Course not found", 404);
  }
  // Get all purchases for this course
  const orders = await OrderModel.find({
    course: courseId,
  })
    .populate({
      path: "user",
      select: "-password",
    })
    .sort({ createdAt: -1 })
    .lean();
  const totalStudents = orders.length;
  const totalRevenue = orders.reduce((total, order) => {
    return total + order.price;
  }, 0);
  return {
    course,
    statistics: {
      totalStudents,
      totalRevenue,
    },
    orders,
  };
};
const courseService = {
  createCourse,
  updateCourse,
  getPublicCourse,
  getAdminCourse,
  getAllCourses,
  getCourseByUser,
  addQuestion,
  addAnswer,
  addReviewCourse,
  addReplyReview,
  getCourses,
  getCoursePurchases,
  getAllCoursesPurchases,
  getTopSellingCourses,
  getOperationCourse,
};
export default courseService;
