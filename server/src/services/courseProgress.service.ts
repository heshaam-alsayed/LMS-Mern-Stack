import { Types } from "mongoose";
import {
  completeLecture,
  createCourseProgress,
  getCourseProgress,
  getUserCoursesProgress,
  updateCurrentLecture,
} from "../repositories/courseProgress.respository";
import AppError from "../utils/AppError";
import {
  getContentCourse,
  getCoursesByIds,
} from "../repositories/course.repository";
import CourseProgressModel from "../models/courseProgress.model";

export const initializeCourseProgress = async (
  userId: string,
  courseId: string,
) => {
  return createCourseProgress(userId, courseId);
};

export const getCourseProgressService = async (
  userId: string,
  courseId: string,
) => {
  if (!userId || !courseId) {
    throw new AppError("CourseId and UserId are required", 400);
  }

  if (!Types.ObjectId.isValid(courseId)) {
    throw new AppError("Invalid course ID", 400);
  }

  const course = await getContentCourse(courseId);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  let progress = await getCourseProgress(userId, courseId);

  if (!progress) {
    progress = await createCourseProgress(userId, courseId);
  }

  const totalLectures = course.courseData.length;
  const completedCount = progress.completedLectures.length;

  const progressPercentage =
    totalLectures === 0
      ? 0
      : Math.round((completedCount / totalLectures) * 100);

  return {
    ...progress.toObject(),
    completedCount,
    totalLectures,
    progressPercentage,
  };
};

export const updateCurrentLectureService = async (
  userId: string,
  courseId: string,
  lectureId: string,
) => {
  if (!userId) {
    throw new AppError("userId is required", 400);
  }

  if (!courseId) {
    throw new AppError("Course ID is required", 400);
  }

  if (!lectureId) {
    throw new AppError("Lecture ID is required", 400);
  }

  if (!Types.ObjectId.isValid(courseId)) {
    throw new AppError("Invalid course ID", 400);
  }

  if (!Types.ObjectId.isValid(lectureId)) {
    throw new AppError("Invalid lecture ID", 400);
  }

  const course = await getContentCourse(courseId);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const lectureExists = course.courseData.some(
    (lecture) => lecture._id.toString() === lectureId,
  );

  if (!lectureExists) {
    throw new AppError("Lecture not found in this course", 404);
  }

  const progress = await updateCurrentLecture(userId, courseId, lectureId);

  if (!progress) {
    throw new AppError("Course progress not found", 404);
  }

  return progress;
};

export const completeLectureService = async (
  userId: string,
  courseId: string,
  lectureId: string,
) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!courseId) {
    throw new AppError("Course ID is required", 400);
  }

  if (!Types.ObjectId.isValid(courseId)) {
    throw new AppError("Invalid course ID", 400);
  }

  if (!lectureId) {
    throw new AppError("Lecture ID is required", 400);
  }

  if (!Types.ObjectId.isValid(lectureId)) {
    throw new AppError("Invalid lecture ID", 400);
  }

  // 4. Check course exists
  const course = await getContentCourse(courseId);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // 5. Check lecture exists inside this course
  const lectureExists = course.courseData.some(
    (lecture) => lecture._id.toString() === lectureId,
  );

  if (!lectureExists) {
    throw new AppError("Lecture not found in this course", 404);
  }

  const progress = await CourseProgressModel.findOne({
    user: userId,
    course: courseId,
  });

  if (!progress) {
    throw new AppError("Course progress not found", 404);
  }

  // Add lecture to completedLectures
  const updatedProgress = await completeLecture(userId, courseId, lectureId);

  if (!updatedProgress) {
    throw new AppError("Failed to update course progress", 500);
  }

  return updatedProgress;
};

export const getUserCoursesProgressService = async (userId: string) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }
  const progress = await getUserCoursesProgress(userId);

  if (!progress.length) {
    return [];
  }
  const courseIds = progress.map((item) => item.course.toString());
  const courses = await getCoursesByIds(courseIds);
  const data = progress
    .map((item) => {
      const course = courses.find(
        (course) => course._id.toString() === item.course.toString(),
      );
      if (!course) {
        return null;
      }
      const totalLectures = course.courseData.length;
      const completedCount = item.completedLectures.length;
      const progressPercentage =
        totalLectures === 0
          ? 0
          : Math.round((completedCount / totalLectures) * 100);
      const currentLecture =
        course.courseData.find(
          (lecture) =>
            lecture._id.toString() === item.currentLecture?.toString(),
        ) ?? null;

      return {
        _id: item._id,
        user: item.user,
        course: {
          _id: course._id,
          name: course.name,
          thumbnail: course.thumbnail,
          level: course.level,
          ratings: course.ratings,
        },
        currentLecture: currentLecture
          ? {
              _id: currentLecture._id,
              title: currentLecture.title,
              videoUrl:currentLecture.videoUrl
            }
          : null,
        completedLectures: item.completedLectures,
        completedCount,
        totalLectures,
        progressPercentage,
        lastAccessedAt: item.lastAccessedAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    })
    .filter(Boolean);

  return data;
};
