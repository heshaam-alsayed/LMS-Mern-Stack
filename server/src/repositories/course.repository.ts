import CourseModel from "../models/course.model";

export const createCourse = async (courseData: any) => {
  return await CourseModel.create(courseData);
};

export const updateCourse = async (courseId: string, courseData: any) => {
  return await CourseModel.findByIdAndUpdate(
    courseId,
    {
      $set: courseData,
    },
    {
      new: true,
    },
  );
};
export const getCourseById = async (courseId: string) => {
  return await CourseModel.findById(courseId).select("thumbnail");
};

export const getFullCourseById = async (courseId: string) => {
  return await CourseModel.findById(courseId);
};

export const getPublicCourse = async (courseId: string) => {
  return await CourseModel.findById(courseId).select(
    "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links",
  );
};

// public courses not purchased
export const getAllCourses = async () => {
  return await CourseModel.find().select(
    "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links",
  );
};

export const getContentCourse = async (courseId: string) => {
  const contentCourse =
    await CourseModel.findById(courseId).select("courseData");
  return contentCourse;
};

export const getCourses = async () => {
  return await CourseModel.find().sort({ createdAt: -1 });
};
const courseRepository = {
  createCourse,
  updateCourse,
  getCourseById,
  getPublicCourse,
  getAllCourses,
  getContentCourse,
  getFullCourseById,
  getCourses,
};
export default courseRepository;
