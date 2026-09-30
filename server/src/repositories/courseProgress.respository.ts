import CourseProgressModel from "../models/courseProgress.model";

export const createCourseProgress = async (
  userId: string,
  courseId: string,
) => {
  return CourseProgressModel.findOneAndUpdate(
    {
      user: userId,
      course: courseId,
    },
    {
      $setOnInsert: {
        user: userId,
        course: courseId,
        currentLecture: null,
        completedLectures: [],
        lastAccessedAt: null,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );
};

export const getCourseProgress = async (userId: string, courseId: string) => {
  return CourseProgressModel.findOne({
    user: userId,
    course: courseId,
  });
};

export const updateCurrentLecture = async (
  userId: string,
  courseId: string,
  lectureId: string,
) => {
  return CourseProgressModel.findOneAndUpdate(
    {
      user: userId,
      course: courseId,
    },
    {
      $set: {
        currentLecture: lectureId,
        lastAccessedAt: new Date(),
      },
    },
    {
      new: true,
    },
  );
};

export const completeLecture = async (
  userId: string,
  courseId: string,
  lectureId: string,
) => {
  return CourseProgressModel.findOneAndUpdate(
    {
      user: userId,
      course: courseId,
    },
    {
      $addToSet: {
        completedLectures: lectureId,
      },
    },
    {
      new: true,
    },
  );
};

export const getUserCoursesProgress = async (userId: string) => {
  return CourseProgressModel.find({
    user: userId,
  })
    .lean();
};
