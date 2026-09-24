import { Types } from "mongoose";
import AppError from "../utils/AppError";
import UserModel from "../models/user.model";
import CourseModel from "../models/course.model";
import {
  createCertificate,
  findCertificateByUserAndCourse,
} from "../repositories/certificate.repository";
import { getCourseProgressService } from "./courseProgress.service";

const generateCertificateId = () => {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `CERT-${Date.now()}-${randomPart}`;
};

export const generateCertificateService = async (
  userId: string,
  courseId: string,
) => {
  if (!userId || !courseId) {
    throw new AppError("User ID and Course ID are required", 400);
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  if (!Types.ObjectId.isValid(courseId)) {
    throw new AppError("Invalid course ID", 400);
  }

  // Get User
  const user = await UserModel.findById(userId).select("name courses email");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Get Course
  const course = await CourseModel.findById(courseId).select("name courseData");

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Check Course Ownership
  const hasPurchasedCourse = user.courses.some(
    (course) => course.toString() === courseId,
  );

  if (!hasPurchasedCourse) {
    throw new AppError("You have not purchased this course", 403);
  }

  // Check Existing Certificate

  const existingCertificate = await findCertificateByUserAndCourse(
    userId,
    courseId,
  );

  if (existingCertificate) {
    return existingCertificate;
  }

  // Get Course Progress

  const progress = await getCourseProgressService(userId, courseId);

  if (!progress) {
    throw new AppError("Course progress not found", 404);
  }

  // Check Course Completion
  if (progress.progressPercentage < 100) {
    throw new AppError(
      "You must complete the course before getting the certificate",
      400,
    );
  }

  const totalDurationInMinutes = course.courseData.reduce((total, lecture) => {
    return total + (lecture.videoLength ?? 0);
  }, 0);

  const learningHours = Number(
  (totalDurationInMinutes / 60).toFixed(1),
);
  // Generate Certificate
  const certificate = await createCertificate({
  certificateId: generateCertificateId(),
  user: new Types.ObjectId(userId),
  course: new Types.ObjectId(courseId),
  studentName: user.name,
  courseTitle: course.name,
  learningHours,
  issuedAt: new Date(),
  });

  return certificate;
};

export const getCertificateService = async (
  userId: string,
  courseId: string,
) => {
  if (!userId || !courseId) {
    throw new AppError("User ID and Course ID are required", 400);
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  if (!Types.ObjectId.isValid(courseId)) {
    throw new AppError("Invalid course ID", 400);
  }

  const certificate = await findCertificateByUserAndCourse(userId, courseId);

  return certificate;
};
