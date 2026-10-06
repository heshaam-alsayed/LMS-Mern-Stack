import courseRepository from "../repositories/course.repository";
import cloudinary from "cloudinary";
import AppError from "../utils/AppError";
import redis from "../utils/redis";
import mongoose, { isValidObjectId, Types } from "mongoose";
import {
  IAddQuestionData,
  IAddReplyReviewData,
  IAddReviewData,
  IAnswerData,
} from "../interfaces/courseInterface";
import {
  COURSE_STATUSES,
  CourseStatus,
} from "../interfaces/courseInterface";
import { calcAverageReviews, calcCourseTotalHours, isValidId } from "../utils/helper";
import { IUser } from "../interfaces/userInterface";
import sendEmail from "../utils/SendEmail";
import {
  COURSE_CACHE_TTL,
  courseCacheKeys,
  invalidateCourseCaches,
} from "../utils/courseCache";
import { IOrder } from "../interfaces/orderInterface";
import notificationRepository from "../repositories/notification.repository";
import CourseModel from "../models/course.model";
import CourseProgressModel from "../models/courseProgress.model";
import userRepository from "../repositories/user.repository";
import UserModel from "../models/user.model";
import { getIO } from "../socketServer";
import { notifyCourseInstructor } from "./notification.service";
import OrderModel from "../models/order.model";
import OrganizationModel from "../models/organization.model";
const getValidCourseStatus = (
  value: unknown,
  fallback: CourseStatus,
): CourseStatus => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (!COURSE_STATUSES.includes(value as CourseStatus)) {
    throw new AppError(
      `Invalid course status. Allowed values: ${COURSE_STATUSES.join(", ")}`,
      400,
    );
  }

  return value as CourseStatus;
};

const getAuthorizedOrganizationId = async (
  actor: CourseUpdateActor,
  course: { organization?: unknown },
) => {
  if (actor.role === "admin") {
    return null;
  }

  if (actor.role !== "instructor") {
    throw new AppError("You are not allowed to edit courses", 403);
  }

  const organization = await OrganizationModel.findOne({
    instructor: actor.id,
  })
    .select("_id")
    .lean();

  if (!organization) {
    throw new AppError("No organization is linked to this account", 404);
  }

  const organizationId = String(organization._id);

  if (String(course.organization) !== organizationId) {
    throw new AppError("Course not found in your organization", 404);
  }

  return organizationId;
};

const updateCourseProgressLectureCount = async (
  courseId: string,
  lectures: any,
) => {
  if (!Array.isArray(lectures)) {
    return;
  }

  await CourseProgressModel.updateMany(
    {
      course: courseId,
      totalLectures: { $ne: lectures.length },
    },
    {
      $set: {
        totalLectures: lectures.length,
      },
    },
  );
};
export const createCourse = async (
  data: any,
  userId: string,
  userRole: "user" | "instructor" | "admin",
) => {
  if (!isValidObjectId(userId)) {
    throw new AppError("Invalid user ID", 400);
  }
  let instructorId: string;
  let organizationId: string;

  // Instructor creates the course
  if (userRole === "instructor") {
    const organization = await OrganizationModel.findOne({
      instructor: userId,
      status: "active",
    });

    if (!organization) {
      throw new AppError("Instructor organization not found", 404);
    }

    instructorId = userId;
    organizationId = organization._id.toString();
  }

  // Admin creates the course
  else if (userRole === "admin") {
    if (!data.instructorId) {
      throw new AppError(
        "Instructor ID is required when admin creates a course",
        400,
      );
    }

    if (!data.organizationId) {
      throw new AppError(
        "Organization ID is required when admin creates a course",
        400,
      );
    }

    if (!isValidObjectId(data.instructorId)) {
      throw new AppError("Invalid instructor ID", 400);
    }

    if (!isValidObjectId(data.organizationId)) {
      throw new AppError("Invalid organization ID", 400);
    }

    // Make sure selected instructor exists and is active
    const instructor = await UserModel.findOne({
      _id: data.instructorId,
      role: "instructor",
      status: "active",
    });

    if (!instructor) {
      throw new AppError("Instructor not found", 404);
    }

    // Make sure the instructor belongs to this organization
    const organization = await OrganizationModel.findOne({
      _id: data.organizationId,
      instructor: data.instructorId,
      status: "active",
    });

    if (!organization) {
      throw new AppError(
        "Instructor does not belong to this organization",
        400,
      );
    }

    instructorId = data.instructorId;
    organizationId = data.organizationId;
  } else {
    throw new AppError("Only instructors and admins can create courses", 403);
  }
  const thumbnail = data.thumbnail;

  if (thumbnail) {
    const result = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courses",
    });
    data.thumbnail = { public_Id: result.public_id, url: result.secure_url };
  }

  // new courses start as draft
  const status = getValidCourseStatus(data.status, "draft");

  // derived data, the body is never allowed to set it
  delete data.reviewsCount;
  delete data.ratings;
  delete data.purchased;
  delete data.totalLectures;
  delete data.totalHours;

  const newCourseData = {
    ...data,
    totalLectures: Array.isArray(data.courseData) ? data.courseData.length : 0,
    totalHours: calcCourseTotalHours(data.courseData),
    status,
    instructor: instructorId,
    organization: organizationId,
    createdBy: userId,
  };
  return await courseRepository.createCourse(newCourseData);
};

type CourseUpdateActor = {
  id: string;
  role: string;
};

export const updateCourse = async (
  courseId: string,
  courseData: any,
  actor: CourseUpdateActor,
) => {
  if (!courseId) {
    throw new AppError("Course id is required", 400);
  }

  if (!isValidObjectId(courseId)) {
    throw new AppError("Invalid course ID", 400);
  }

  if (!actor?.id) {
    throw new AppError("Not authenticated", 401);
  }

  const course = await courseRepository.getCourseById(courseId);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const organizationId = await getAuthorizedOrganizationId(
  actor,
  course,
);

  if (organizationId) {
    // organization comes from session, not body
    courseData.organization = organizationId;
    delete courseData.instructor;
    delete courseData.createdBy;
  }

  if (courseData.status !== undefined) {
    courseData.status = getValidCourseStatus(courseData.status, "draft");
  }

  // derived data, only the review writes, the lecture writes and the backfill
  // script are allowed to change it
  delete courseData.reviewsCount;
  delete courseData.ratings;
  delete courseData.totalLectures;
  delete courseData.totalHours;

  // the lecture count and the duration mirror courseData, so they are
  // recomputed only when the write actually carries a new curriculum
  if (Array.isArray(courseData.courseData)) {
    courseData.totalLectures = courseData.courseData.length;
    courseData.totalHours = calcCourseTotalHours(courseData.courseData);
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

    await updateCourseProgressLectureCount(courseId, courseData.courseData);

    // drop every cached copy of this course
    await invalidateCourseCaches(courseId, String(course.organization));

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

  // No new thumbnail keep existing thumbnail
  const updatedCourse = await courseRepository.updateCourse(
    courseId,
    courseData,
  );

  await updateCourseProgressLectureCount(courseId, courseData.courseData);

  await invalidateCourseCaches(courseId, String(course.organization));

  return updatedCourse;
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

  const cacheKey = courseCacheKeys.admin(courseId);

  const cachedCourse = await redis.get(cacheKey);

  if (cachedCourse) {
    return JSON.parse(cachedCourse);
  }

  const course = await courseRepository.getFullCourseById(courseId);
  if (!course) throw new AppError("Course id not found", 400);

  await redis.set(cacheKey, JSON.stringify(course), "EX", COURSE_CACHE_TTL);

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
    organization: course?.organization,
  });

  await course?.save({
    validateBeforeSave: false,
  });
  await invalidateCourseCaches(courseId, String(course.organization));

  const io = getIO();
  io.to("admins").emit("notification", notification);

  await notifyCourseInstructor({
    organizationId: course?.organization,
    actor: { _id: user._id, name: user.name },
    title: "New Course Question",
    message: `${user.name} asked a question in "${courseContent?.title}" of ${course.name}.`,
  });

  return course;
};

export const addAnswer = async (
  data: IAnswerData,
  actor: CourseUpdateActor,
) => {
  const { answer, questionId, contentId, courseId } = data;

  const course = await courseRepository.getFullCourseById(courseId);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // replies belong to the course owner so a student cannot answer
  await getAuthorizedOrganizationId(actor, course as any);

  const user = await userRepository.getSafeUser(actor.id);

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
  await invalidateCourseCaches(courseId, String(course.organization));

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

    // the answer is already saved so a mail failure must not fail the request
    try {
      await sendEmail({
        email: isExistQuestion.user.email,
        subject: "Question Answered",
        template: "question-reply.ejs",
        data: emailData,
      });
    } catch {
    }
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
  course.reviewsCount = course.reviews.length;

  await course.save({ validateBeforeSave: false });
  await invalidateCourseCaches(courseId, String(course.organization));
  const notification = await notificationRepository.createNotification({
    user: user._id,
    title: "New Review Recieved",
    message: `${user.name} has give a review in "${course.name}".`,
    organization: course.organization,
  });

  const io = getIO();
  io.to("admins").emit("notification", notification);

  await notifyCourseInstructor({
    organizationId: course.organization,
    actor: { _id: user._id, name: user.name },
    title: "New Review on Your Course",
    message: `${user.name} rated "${course.name}" ${rating} out of 5.`,
  });

  return course;
};

export const addReplyReview = async (
  data: IAddReplyReviewData,
  actor: CourseUpdateActor,
) => {
  const { comment, reviewId, courseId } = data;

  const course = await courseRepository.getFullCourseById(courseId);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // review replies belong to the course owner or an admin
  await getAuthorizedOrganizationId(actor, course as any);

  const user = await userRepository.getSafeUser(actor.id);

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
  await invalidateCourseCaches(courseId, String(course.organization));

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
      "name description price category estimatePrice thumbnail level reviews reviewsCount totalLectures ratings purchased createdAt updatedAt",
    )
    .populate("category", "slug title")
    .populate("organization", "name status")
    .populate("instructor", "name email avatar")
    .populate("createdBy", "name email avatar role");
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
