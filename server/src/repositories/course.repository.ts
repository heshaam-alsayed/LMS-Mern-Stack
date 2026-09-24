import {
  IComment,
  ILink,
  IPublicCourseData,
} from "../interfaces/courseInterface";
import CourseModel from "../models/course.model";
import ApiFeatures from "../utils/apiFeatures";

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
  const course = await CourseModel.findById(courseId)
    .select("-courseData.questions -courseData.links")
    .populate("category", "slug title")
    .lean();

  if (!course) {
    return null;
  }

  const courseData: IPublicCourseData[] = course.courseData.map((item) => {
    const data: IPublicCourseData = {
      title: item.title,
      description: item.description,
      videoThumbnail: item.videoThumbnail,
      videoSection: item.videoSection,
      videoLength: item.videoLength,
      isFree: item.isFree,
      videoPlayer: item.videoPlayer,
    };

    if (item.isFree) {
      data.videoUrl = item.videoUrl;
    }

    return data;
  });

  return {
    ...course,
    courseData,
  };
};

// public courses not purchased
export const getAllCourses = async (queryString: any) => {
  const query = CourseModel.find().select(
    "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links",
  );

  const features = new ApiFeatures(query, queryString)
    .filter(["price", "estimatePrice", "level", "ratings" ,"category"])
    .search(["name", "description", "tags"])
    .sort(["price", "estimatePrice", "ratings", "purchased", "createdAt"]);

  // Use a clone for count
  const total = await features.query.clone().countDocuments();

  // Apply pagination to the original query
  features.paginate();

  // Execute the original query
  const courses = await features.query;

  const pagination = features.getPagination(total);

  return {
    courses,
    pagination,
  };
};

export const getContentCourse = async (courseId: string) => {
  const contentCourse = await CourseModel.findById(courseId);
  return contentCourse;
};

export const getCourses = async () => {
  return await CourseModel.find().sort({ createdAt: -1 });
};

export const getCoursesByIds = async (courseIds: string[]) => {
  return CourseModel.find({
    _id: {
      $in: courseIds,
    },
  }).lean();
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
  getCoursesByIds
};
export default courseRepository;
