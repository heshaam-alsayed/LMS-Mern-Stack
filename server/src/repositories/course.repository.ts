import { Types } from "mongoose";
import {
  IComment,
  ICourse,
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

  return await CourseModel.findById(courseId).select("thumbnail organization");
};

export const getFullCourseById = async (courseId: string) => {
  return await CourseModel.findById(courseId);
};

export const getPublicCourse = async (courseId: string) => {
  const course = await CourseModel.findOne({ _id: courseId, status: "published" })
    .select("-courseData.questions -courseData.links")
    .populate("category", "slug title")
    .populate("instructor", "name")
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

// Public courses
export const getAllCourses = async (queryString: any) => {
  const query = CourseModel.find({ status: "published" })
    .select(
      "name description price estimatePrice instructor thumbnail level ratings reviewsCount purchased totalLectures totalHours createdAt",
    )
    .populate({
      path: "instructor",
      select: "name",
    });

  const features = new ApiFeatures(query, queryString)
    .filter([
      "price",
      "estimatePrice",
      "level",
      "ratings",
      "reviewsCount",
      "totalLectures",
      "totalHours",
      "category",
    ])
    .search(["name", "description", "tags"])
    .sort([
      "price",
      "estimatePrice",
      "ratings",
      "purchased",
      "reviewsCount",
      "totalLectures",
      "totalHours",
      "createdAt",
    ]);

  const total = await features.query.clone().countDocuments();

  features.paginate();

  const courses = (await features.query.lean()) as unknown as (ICourse & {
    _id: Types.ObjectId;
  })[];

  const pagination = features.getPagination(total);

  const [bestSellerCourses, highestRatedCourses] = await Promise.all([
    CourseModel.find({ status: "published" })
      .sort({ purchased: -1 })
      .limit(10)
      .select("_id")
      .lean(),

    CourseModel.find({
      status: "published",
      reviewsCount: { $gte: 10 },
    })
      .sort({ ratings: -1 })
      .limit(10)
      .select("_id")
      .lean(),
  ]);

  const bestSellerIds = new Set(
    bestSellerCourses.map((course) => String(course._id)),
  );

  const highestRatedIds = new Set(
    highestRatedCourses.map((course) => String(course._id)),
  );

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const coursesWithBadges = courses.map((course) => ({
    ...course,
    isBestseller: bestSellerIds.has(String(course._id)),
    isHighestRated: highestRatedIds.has(String(course._id)),
    isNew: course.createdAt >= thirtyDaysAgo,
  }));

  return {
    courses: coursesWithBadges,
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
  getCoursesByIds,
};
export default courseRepository;
