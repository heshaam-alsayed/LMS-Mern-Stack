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

  if (thumbnail) {
    if (course.thumbnail?.public_Id) {
      await cloudinary.v2.uploader.destroy(course.thumbnail?.public_Id);
    }
    const result = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courses",
    });

    courseData.thumbnail = {
      public_Id: result.public_id,
      url: result.secure_url,
    };
  }

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

  await redis.set(courseId, JSON.stringify(course), "EX", 7 * 24 * 60 * 60);
  return course;
};

// get all courses public not purchased
export const getAllCourses = async () => {
  const isCachedCourses = await redis.get("allCourses");

  if (isCachedCourses) {
    return JSON.parse(isCachedCourses);
  }
  const courses = await courseRepository.getAllCourses();

  await redis.set("allCourses", JSON.stringify(courses));
  return courses;
};

// get course by user for purchased
export const getCourseByUser = async (
  courseId: string,
  coursesUserList: Types.ObjectId[],
) => {
  if (!courseId) throw new AppError("Course id is required", 400);

  // check course is exist in list of course user enrolled
  const courseExist = coursesUserList.some((id) => id.toString() === courseId);
  if (!courseExist)
    throw new AppError("you have not purchased to access this course", 404);
  const contentCourse = await courseRepository.getContentCourse(courseId);

  return contentCourse;
};

export const addQuestion = async (data: IAddQuestionData, userData: IUser) => {
  const { question, contentId, courseId } = data;
  // get course by id
  if (!isValidId(contentId) || !isValidId(courseId))
    throw new AppError("Content id or course id is invalid", 400);
  const course = await courseRepository.getFullCourseById(courseId);

  // find content by id
  const courseContent = course?.courseData.find(
    (item) => item._id.toString() === contentId,
  );
  if (!courseContent) throw new AppError("Content Id not found", 404);

  const questionData: any = {
    user: userData,
    question,
    questionReplies: [],
  };

  // push question to content
  courseContent.questions.push(questionData);

  // send and create notification
  await notificationRepository.createNotification({
    user: userData._id,
    title: " new question received",
    message: `${userData.name} ask a question in ${courseContent?.title} lesson`,
  });

  await course?.save({
    validateBeforeSave: false,
  });
  return course;
};

export const addAnswer = async (data: IAnswerData, userData: IUser) => {
  const { answer, questionId, contentId, courseId } = data;

  const course = await courseRepository.getFullCourseById(courseId);

  if (!course) {
    throw new AppError("Course not found", 404);
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
    user: userData,
    answer,
  };

  isExistQuestion.questionReplies = isExistQuestion.questionReplies || [];

  isExistQuestion.questionReplies.push(answerData);

  await course.save({ validateBeforeSave: false });

  if (userData._id.toString() === isExistQuestion.user._id.toString()) {
    // send and create notification
    await notificationRepository.createNotification({
      user: userData._id,
      title: " new question reply received",
      message: `${userData.name} ask a question in ${courseContent?.title}`,
    });
  } else {
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
  coursesUserList: Types.ObjectId[],
  userData: IUser,
) => {
  const { review, rating } = data;

  if (rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }

  const courseExist = coursesUserList.some(
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
    (r: any) => r.user._id === userData._id.toString(),
  );

  if (alreadyReviewed) {
    throw new AppError("You already reviewed this course", 400);
  }

  const reviewData: any = {
    user: userData,
    comment: review,
    rating,
  };

  course.reviews.push(reviewData);

  const averageRating = calcAverageReviews(course.reviews);
  course.ratings = averageRating;

  await course.save({ validateBeforeSave: false });

  return course;
};

export const addReplyReview = async (
  data: IAddReplyReviewData,
  userData: IUser,
) => {
  const { comment, reviewId, courseId } = data;

  const course = await courseRepository.getFullCourseById(courseId);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const review = course.reviews.find(
    (item: any) => item._id.toString() === reviewId.toString(),
  );

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  const replyData: any = {
    user: {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
    },

    comment,
  };

  review.commentReplies = review.commentReplies || [];

  review.commentReplies.push(replyData);
  await course.save({
    validateBeforeSave: false,
  });

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

  return await CourseModel.find()
    .sort({ purchased: -1 })
    .limit(finalLimit)
    .select("name purchased price");
};

const courseService = {
  createCourse,
  updateCourse,
  getPublicCourse,
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
};
export default courseService;
