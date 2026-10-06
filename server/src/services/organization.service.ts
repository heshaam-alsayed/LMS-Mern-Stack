import { isValidObjectId, PipelineStage, Types } from "mongoose";

import CertificateModel from "../models/certificate.model";
import CategoryModel from "../models/category.model";
import CourseModel from "../models/course.model";

import CourseProgressModel from "../models/courseProgress.model";

import OrderModel from "../models/order.model";
import OrganizationModel from "../models/organization.model";

import UserModel from "../models/user.model";

import ApiFeatures from "../utils/apiFeatures";

import redis, { getCached, setCached, delCached } from "../utils/redis";

import { COURSE_CACHE_TTL, courseCacheKeys } from "../utils/courseCache";

import { getMonthlyAnalytics } from "../utils/analytics";

import AppError from "../utils/AppError";

import { slugify } from "../utils/helper";

const VALID_STATUSES = ["active", "suspended"];

const USER_ORDER_FIELDS = "name email phone status avatar";

const COURSE_ORDER_FIELDS =
  "name category status price ratings purchased reviewsCount totalLectures level thumbnail";

const validateId = (id: string) => {
  if (!id) {
    throw new AppError("Organization ID is required", 400);
  }

  if (!isValidObjectId(id)) {
    throw new AppError("Invalid organization ID", 400);
  }
};

const ORG_CACHE_TTL = 600;
const ORG_PERF_CACHE_TTL = 60;

const orgCacheKey = (instructorId: string) =>
  `org:byInstructor:${instructorId}`;

const orgPerfGenerationKey = (organizationId: string) =>
  `org:perfGen:${organizationId}`;

/**
 * a lean document cached as json comes back with a string _id. mongoose casts
 * a string for find/countDocuments, but an aggregation pipeline is never cast,
 * so a cached organization silently produced empty $match results. every read
 * of a cached lean document goes through here instead.
 */
const reviveCachedIds = <T extends Record<string, any>>(document: T): T => {
  if (document?._id && typeof document._id === "string") {
    return { ...document, _id: new Types.ObjectId(document._id) };
  }

  return document;
};

const getOrgPerfGeneration = async (organizationId: string) => {
  try {
    const raw = await redis.get(orgPerfGenerationKey(organizationId));
    const generation = Number(raw);

    return Number.isFinite(generation) && generation > 0 ? generation : 1;
  } catch {
    return 1;
  }
};

const orgCoursesPerformanceCacheKey = (
  organizationId: string,
  page: number,
  limit: number,
) => `org:coursesPerformance:${organizationId}:${page}:${limit}`;

export const invalidateOrgCachesByInstructor = async (instructorId: string) => {
  try {
    await delCached(orgCacheKey(instructorId));
  } catch (error) {
    console.error("organization cache invalidation failed:", error);
  }
};

const ORG_DASHBOARD_STATS_TTL = 60;
const ORG_CERT_STATS_TTL = 60;
const ORG_ORDERS_SUMMARY_TTL = 60;
const ORG_ANALYTICS_TTL = 300;

const orgDashboardStatsKey = (organizationId: string) =>
  `org:dashboardStats:${organizationId}`;

const orgCertStatsKey = (organizationId: string) =>
  `org:certStats:${organizationId}`;

const orgOrdersSummaryKey = (organizationId: string) =>
  `org:ordersSummary:${organizationId}`;

const orgCoursesAnalyticsKey = (organizationId: string, year: number) =>
  `org:coursesAnalytics:${organizationId}:${year}`;

const orgOrdersAnalyticsKey = (organizationId: string, year: number) =>
  `org:ordersAnalytics:${organizationId}:${year}`;

const orgCourseOrdersKey = (organizationId: string, courseId: string) =>
  `org:courseOrders12m:${organizationId}:${courseId}`;

export const invalidateOrgDataCaches = async (organizationId: string) => {
  try {
    await delCached(
      orgDashboardStatsKey(organizationId),
      orgCertStatsKey(organizationId),
      orgOrdersSummaryKey(organizationId),
    );

    // the performance pages are paginated, so they are orphaned with a
    // generation bump instead of a scan over every page key
    await redis.incr(orgPerfGenerationKey(organizationId));
    await redis.expire(orgPerfGenerationKey(organizationId), 60 * 60 * 24 * 7);
  } catch (error) {
    console.error("organization data cache invalidation failed:", error);
  }
};

export const invalidateOrgCourseOrdersCache = async (
  organizationId: string,
  courseId: string,
) => {
  try {
    await delCached(orgCourseOrdersKey(organizationId, courseId));
  } catch (error) {
    console.error(
      "organization course orders cache invalidation failed:",
      error,
    );
  }
};

// get organization for auhtentication instructor
export const getMyOrganizationService = async (instructorId: string) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  const cacheKey = orgCacheKey(instructorId);

  const cachedOrganization = await getCached<any>(cacheKey);

  if (cachedOrganization) {
    return reviveCachedIds(cachedOrganization);
  }

  const organization = await OrganizationModel.findOne({
    instructor: instructorId,
  })

    .select("_id name slug description status createdAt updatedAt")

    .lean();

  if (!organization) {
    throw new AppError("No organization is linked to this account", 404);
  }

  await setCached(cacheKey, organization, ORG_CACHE_TTL);

  return organization;
};

// get organization statistics for authenticated instructor or for sepecific instructor
export const getMyOrganizationDashboardStatisticsService = async (
  instructorId: string,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  const organization = await getMyOrganizationService(instructorId);

  const cacheKey = orgDashboardStatsKey(String(organization._id));

  const cachedDashboard = await getCached<any>(cacheKey);

  if (cachedDashboard) {
    return cachedDashboard;
  }

  const filter = {
    organization: organization._id,
  };

  const [totalCourses, totalOrders, totalStudents, certificateStats] =
    await Promise.all([
      CourseModel.countDocuments(filter),

      OrderModel.countDocuments(filter),

      OrderModel.distinct("user", filter),

      CertificateModel.aggregate([
        { $match: { organization: new Types.ObjectId(String(organization._id)) } },
        {
          $group: {
            _id: null,
            totalCertificates: { $sum: 1 },
            totalLearningHours: { $sum: "$learningHours" },
          },
        },
      ]),
    ]);

  const totalLearningHours = certificateStats[0]?.totalLearningHours ?? 0;

  const dashboard = {
    organization,

    statistics: {
      totalStudents: totalStudents.length,
      totalCourses,
      totalOrders,
      totalCertificates: certificateStats[0]?.totalCertificates ?? 0,
      totalLearningHours: Number(totalLearningHours.toFixed(1)),
    },
  };

  await setCached(cacheKey, dashboard, ORG_DASHBOARD_STATS_TTL);

  return dashboard;
};

// get courses performance for specific instructor
export const getMyOrganizationCoursesPerformanceService = async (
  instructorId: string,
  page = 1,
  limit = 10,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  const organization = await getMyOrganizationService(instructorId);

  const currentPage = Math.max(Number(page) || 1, 1);
  const currentLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const performanceGeneration = await getOrgPerfGeneration(
    String(organization._id),
  );

  const cacheKey = `${orgCoursesPerformanceCacheKey(
    String(organization._id),
    currentPage,
    currentLimit,
  )}:${performanceGeneration}`;

  const cachedStatistics = await getCached<any>(cacheKey);

  if (cachedStatistics) {
    return cachedStatistics;
  }

  const skip = (currentPage - 1) * currentLimit;

  const filter = {
    organization: organization._id,
  };

  const [courses, totalCourses] = await Promise.all([
    CourseModel.find(filter)
      .select("_id name ratings")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(currentLimit)
      .lean(),

    CourseModel.countDocuments(filter),
  ]);

  const courseIds = courses.map((course) => course._id);

  // an aggregation pipeline is never cast by mongoose, so the ids are turned
  // into real ObjectIds here instead of trusting whatever the caller passed
  const organizationObjectId = new Types.ObjectId(String(organization._id));

  // Get orders statistics for these courses
  const orderStats = await OrderModel.aggregate([
    {
      $match: {
        organization: organizationObjectId,
        course: { $in: courseIds },
      },
    },
    {
      $group: {
        _id: "$course",
        students: {
          $addToSet: "$user",
        },
        revenue: {
          $sum: "$price",
        },
      },
    },
  ]);

  // Get progress for these courses
  const progressStats = await CourseProgressModel.find({
    organization: organization._id,
    course: { $in: courseIds },
  })
    .select("course totalLectures completedLectures")
    .lean();

  const statistics = courses.map((course) => {
    // Find orders for this course
    const orders = orderStats.find(
      (order) => String(order._id) === String(course._id),
    );

    const totalStudents = orders?.students?.length ?? 0;

    // Find progress for this course
    const courseProgress = progressStats.filter(
      (progress) => String(progress.course) === String(course._id),
    );

    // Count students who completed all lectures
    const completedStudents = courseProgress.filter(
      (progress) =>
        progress.totalLectures > 0 &&
        progress.completedLectures.length >= progress.totalLectures,
    ).length;

    // Calculate completion percentage
    const completion =
      totalStudents > 0
        ? Math.round((completedStudents / totalStudents) * 100)
        : 0;

    return {
      _id: course._id,
      course: course.name,
      students: totalStudents,
      revenue: orders?.revenue ?? 0,
      rating: course.ratings ?? 0,
      completion,
    };
  });

  const totalPages = Math.ceil(totalCourses / currentLimit);

  const result = {
    organization,
    result: statistics.length,
    statistics,
    pagination: {
      currentPage,
      limit: currentLimit,
      total: totalCourses,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };

  await setCached(cacheKey, result, ORG_PERF_CACHE_TTL);

  return result;
};

// get analytics order for specific course last 12 month
export const getCourseOrdersLast12MonthsService = async (
  courseId: string,
  organizationId: string,
) => {
  if (!courseId) {
    throw new AppError("Course ID is required", 400);
  }

  if (!Types.ObjectId.isValid(courseId)) {
    throw new AppError("Invalid course ID", 400);
  }

  if (!Types.ObjectId.isValid(organizationId)) {
    throw new AppError("Invalid organization ID", 400);
  }

  const course = await CourseModel.findOne({
    _id: courseId,
    organization: organizationId,
  })
    .select("_id name")
    .lean();

  if (!course) {
    throw new AppError("Course not found in your organization", 404);
  }

  const cacheKey = orgCourseOrdersKey(organizationId, courseId);

  const cachedOrders = await getCached<any>(cacheKey);

  if (cachedOrders) {
    return cachedOrders;
  }

  const endDate = new Date();

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 11);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const orders = await OrderModel.aggregate([
    {
      $match: {
        course: new Types.ObjectId(courseId),
        organization: new Types.ObjectId(organizationId),
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },

    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },

        orders: {
          $sum: 1,
        },

        revenue: {
          $sum: "$price",
        },
      },
    },
  ]);

  const orderMap = new Map(
    orders.map((item) => [
      `${item._id.year}-${item._id.month}`,
      {
        orders: item.orders,
        revenue: item.revenue,
      },
    ]),
  );

  const result = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date();

    date.setDate(1);

    date.setMonth(date.getMonth() - i);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const key = `${year}-${month}`;

    const data = orderMap.get(key);

    result.push({
      year,
      month,
      monthName: date.toLocaleString("en-US", {
        month: "short",
      }),
      orders: data?.orders ?? 0,
      revenue: data?.revenue ?? 0,
    });
  }

  const ordersResult = {
    course: {
      _id: course._id,
      name: course.name,
    },
    totalOrders: result.reduce((total, item) => total + item.orders, 0),
    totalRevenue: result.reduce((total, item) => total + item.revenue, 0),
    monthly: result,
  };

  await setCached(cacheKey, ordersResult, ORG_ORDERS_SUMMARY_TTL);

  return ordersResult;
};

// get all courses for specific instrutor
export const getOrganizationCoursesForInstructorService = async (
  id: string,

  instructorId: string,

  queryString: Record<string, any>,
) => {
  validateId(id);

  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  const organization = await OrganizationModel.findById(id).select(
    "_id name status instructor",
  );

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  if (String(organization.instructor) !== String(instructorId)) {
    throw new AppError(
      "You are not allowed to access courses of this organization",

      403,
    );
  }

  const features = new ApiFeatures(
    CourseModel.find({ organization: id }).select(
      "name description price estimatePrice thumbnail level status ratings purchased reviewsCount totalLectures createdAt updatedAt",
    ),

    queryString,
  )

    .filter([
      "price",
      "estimatePrice",
      "level",
      "status",
      "ratings",
      "purchased",
      "reviewsCount",
      "totalLectures",
    ])

    .search(["name", "description"])

    .sort([
      "price",
      "estimatePrice",
      "ratings",
      "purchased",
      "reviewsCount",
      "totalLectures",
      "createdAt",
    ]);

  features.query = features.query.merge({
    organization: new Types.ObjectId(id),
  });

  const total = await features.query.clone().countDocuments();

  features.paginate();

  const courses = await features.query;

  const pagination = features.getPagination(total);

  return {
    organization: {
      _id: organization._id,

      name: organization.name,

      status: organization.status,
    },

    result: courses.length,

    pagination,

    courses,
  };
};

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

type SortDirection = 1 | -1;

const STUDENT_SORT_FIELDS: Record<string, SortDirection> = {
  purchasedCount: 1,

  "-purchasedCount": -1,

  name: 1,

  "-name": -1,

  createdAt: 1,

  "-createdAt": -1,
};

// get all orders about courses for specific instructor
export const getOrganizationOrdersForInstructorService = async (
  instructorId: string,
  queryString: Record<string, any>,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  const organization = await getMyOrganizationService(instructorId);

  const search =
    typeof queryString.search === "string" ? queryString.search.trim() : "";

  const page = Number(queryString.page) || 1;
  const limit = Number(queryString.limit) || 10;

  const skip = (page - 1) * limit;

  let userIds: Types.ObjectId[] = [];
  let courseIds: Types.ObjectId[] = [];

  // Search users and courses
  if (search) {
    const users = await UserModel.find({
      name: {
        $regex: search,
        $options: "i",
      },
    }).select("_id");

    const courses = await CourseModel.find({
      name: {
        $regex: search,
        $options: "i",
      },
    }).select("_id");

    userIds = users.map((user) => user._id);
    courseIds = courses.map((course) => course._id);
  }

  const query: Record<string, any> = {
    organization: organization._id,
  };

  // Apply search only to displayed orders
  if (search) {
    query.$or = [
      {
        user: {
          $in: userIds,
        },
      },
      {
        course: {
          $in: courseIds,
        },
      },
    ];
  }

  // Total orders + revenue are org-wide and repeated on every page/search
  const ordersSummaryKey = orgOrdersSummaryKey(String(organization._id));

  const cachedSummary = await getCached<any>(ordersSummaryKey);

  let summary: { totalOrders: number; totalRevenue: number };

  if (cachedSummary) {
    summary = cachedSummary;
  } else {
    const totalOrders = await OrderModel.countDocuments({
      organization: organization._id,
    });

    // Total revenue
    const revenue = await OrderModel.aggregate([
      {
        $match: {
          organization: organization._id,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$price",
          },
        },
      },
    ]);

    summary = {
      totalOrders,
      totalRevenue: revenue[0]?.totalRevenue ?? 0,
    };

    await setCached(ordersSummaryKey, summary, ORG_ORDERS_SUMMARY_TTL);
  }

  // Orders for current page
  const orders = await OrderModel.find(query)
    .populate("user", USER_ORDER_FIELDS)
    .populate({
      path: "course",
      select: COURSE_ORDER_FIELDS,
      populate: {
        path: "category",
        select: "title slug",
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(summary.totalOrders / limit);

  return {
    organization,

    result: orders.length,

    summary,

    pagination: {
      currentPage: page,
      limit,
      total: summary.totalOrders,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },

    orders,
  };
};

// get students that pusrhsed courses with specific organization
export const getOrganizationStudentsForInstructorService = async (
  instructorId: string,
  queryString: Record<string, any>,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  const organization = await getMyOrganizationService(instructorId);

  const page = Math.max(Number(queryString.page) || 1, 1);
  const limit = Math.min(Math.max(Number(queryString.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const search =
    typeof queryString.search === "string" ? queryString.search.trim() : "";

  // Get students who purchased from this organization
  const orders = await OrderModel.aggregate([
    {
      $match: {
        organization: organization._id,
      },
    },
    {
      $group: {
        _id: "$user",
        purchasedCount: {
          $sum: 1,
        },
      },
    },
  ]);

  const userIds = orders.map((order) => order._id);

  // Search users
  const userQuery: Record<string, any> = {
    _id: { $in: userIds },
    isDeleted: false,
  };

  if (search) {
    userQuery.name = {
      $regex: escapeRegex(search),
      $options: "i",
    };
  }

  const total = await UserModel.countDocuments(userQuery);

  const users = await UserModel.find(userQuery)
    .select("name email avatar status")
    .sort({ name: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const students = users.map((user) => {
    const order = orders.find(
      (order) => String(order._id) === String(user._id),
    );

    return {
      ...user,
      purchasedCount: order?.purchasedCount ?? 0,
    };
  });

  const totalPages = Math.ceil(total / limit);

  return {
    organization,

    result: students.length,

    summary: {
      totalStudents: total,
    },

    students,

    pagination: {
      currentPage: page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

// get courses progress for student in specific organization
export const getOrganizationStudentProgressService = async (
  instructorId: string,
  studentId: string,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  if (!studentId || !isValidObjectId(studentId)) {
    throw new AppError("Invalid student ID", 400);
  }

  const organization = await getMyOrganizationService(instructorId);

  const studentObjectId = new Types.ObjectId(studentId);

  const purchases = await OrderModel.find({
    organization: organization._id,
    user: studentObjectId,
  })
    .select("course")
    .lean();

  if (purchases.length === 0) {
    throw new AppError("Student not found in your organization", 404);
  }

  const courseIds = [
    ...new Set(purchases.map((order) => String(order.course))),
  ];

  const [student, courses, progressRows] = await Promise.all([
    UserModel.findById(studentObjectId)
      .select("name email phone status avatar createdAt")
      .lean(),

    CourseModel.find({
      _id: { $in: courseIds },
      organization: organization._id,
    })
      .select("name status thumbnail category courseData")
      .populate("category", "title")
      .populate("thumbnail", "url")
      .lean(),

    CourseProgressModel.find({
      user: studentObjectId,
      course: { $in: courseIds },
    })
      .select("course currentLecture completedLectures lastAccessedAt")
      .lean(),
  ]);

  if (!student) {
    throw new AppError("Student not found in your organization", 404);
  }

  const progressByCourse = new Map(
    progressRows.map((row) => [String(row.course), row]),
  );

  const items = courses.map((course) => {
    const totalLectures = course.courseData?.length ?? 0;

    const progress = progressByCourse.get(String(course._id));

    const completedCount = progress?.completedLectures?.length ?? 0;

    const progressPercentage =
      totalLectures === 0
        ? 0
        : Math.min(Math.round((completedCount / totalLectures) * 100), 100);

    return {
      course: {
        _id: String(course._id),
        name: course.name,
        status: course.status,
        thumbnail: course.thumbnail
          ? {
              url: (course.thumbnail as any).url,
            }
          : null,
        category: course.category
          ? {
              _id: String((course.category as any)._id),
              title: (course.category as any).title,
            }
          : null,
      },

      totalLectures,

      completedCount,

      progressPercentage,

      currentLecture: progress?.currentLecture
        ? String(progress.currentLecture)
        : null,

      lastAccessedAt: progress?.lastAccessedAt ?? null,
    };
  });

  items.sort((a, b) => {
    if (a.progressPercentage !== b.progressPercentage) {
      return b.progressPercentage - a.progressPercentage;
    }

    return a.course.name.localeCompare(b.course.name);
  });

  const completedCourses = items.filter(
    (item) => item.progressPercentage === 100,
  ).length;

  const startedCourses = items.filter(
    (item) => item.progressPercentage > 0 && item.progressPercentage < 100,
  ).length;

  const notStartedCourses = items.filter(
    (item) => item.progressPercentage === 0,
  ).length;

  const totalLectures = items.reduce(
    (sum, item) => sum + item.totalLectures,
    0,
  );

  const completedLectures = items.reduce(
    (sum, item) => sum + item.completedCount,
    0,
  );

  const overallPercentage =
    totalLectures === 0
      ? 0
      : Math.min(Math.round((completedLectures / totalLectures) * 100), 100);

  return {
    organization,

    student,

    summary: {
      totalCourses: items.length,
      completedCourses,
      startedCourses,
      notStartedCourses,
      totalLectures,
      completedLectures,
      overallPercentage,
    },

    courses: items,
  };
};

// get courseDetails to view questions , reviews for instructor
export const getOrganizationCourseDetailService = async (
  instructorId: string,
  courseId: string,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  if (!courseId || !isValidObjectId(courseId)) {
    throw new AppError("Invalid course ID", 400);
  }

  const organization = await getMyOrganizationService(instructorId);

  const course = await CourseModel.findOne({
    _id: courseId,
    organization: organization._id,
  })
    .select(
      "name description status price level ratings purchased reviewsCount totalLectures thumbnail category tags createdAt updatedAt courseData reviews",
    )
    .populate("category", "title slug")
    .populate("thumbnail", "url")
    .lean();

  if (!course) {
    throw new AppError("Course not found in your organization", 404);
  }

  const questions = (course.courseData ?? []).flatMap((lecture) =>
    (lecture.questions ?? []).map((question: any) => ({
      _id: String(question._id),
      question: question.question,
      lecture: {
        _id: String(lecture._id),
        title: lecture.title,
      },
      askedBy: question.user
        ? {
            _id: String(question.user._id),
            name: question.user.name,
            avatar: question.user.avatar ?? null,
          }
        : null,
      replies: (question.questionReplies ?? []).map((reply: any) => ({
        _id: String(reply._id),
        answer: reply.answer,
        repliedBy: reply.user
          ? {
              _id: String(reply.user._id),
              name: reply.user.name,
              avatar: reply.user.avatar ?? null,
            }
          : null,
      })),
      createdAt: question.createdAt,
    })),
  );

  const reviews = (course.reviews ?? []).map((review: any) => ({
    _id: String(review._id),
    comment: review.comment,
    rating: review.rating,
    createdAt: review.createdAt,
    user: review.user
      ? {
          _id: String(review.user._id),
          name: review.user.name,
          avatar: review.user.avatar ?? null,
        }
      : null,
    replies: (review.commentReplies ?? []).map((reply: any) => ({
      _id: String(reply._id),
      comment: reply.comment,
      repliedBy: reply.user
        ? {
            _id: String(reply.user._id),
            name: reply.user.name,
            avatar: reply.user.avatar ?? null,
          }
        : null,
    })),
  }));

  questions.sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime(),
  );

  reviews.sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime(),
  );

  return {
    organization: {
      _id: String(organization._id),
      name: organization.name,
      status: organization.status,
    },

    course: {
      _id: String(course._id),
      name: course.name,
      description: course.description,
      status: course.status,
      price: course.price,
      level: course.level,
      ratings: course.ratings ?? 0,
      purchased: course.purchased ?? 0,
      reviewsCount: course.reviewsCount ?? 0,
      tags: course.tags ?? "",
      thumbnail: course.thumbnail?.url ?? null,
      category: course.category
        ? {
            _id: String((course.category as any)._id),
            title: (course.category as any).title,
            slug: (course.category as any).slug,
          }
        : null,
      createdAt: (course as any).createdAt ?? null,
      updatedAt: (course as any).updatedAt ?? null,

      totalLectures: course.totalLectures ?? (course.courseData ?? []).length,

      lectures: (course.courseData ?? []).map((lecture) => ({
        _id: String(lecture._id),
        title: lecture.title,
        questionCount: (lecture.questions ?? []).length,
      })),
    },

    summary: {
      totalQuestions: questions.length,
      answeredQuestions: questions.filter((q) => q.replies.length > 0).length,
      totalReviews: reviews.length,
      averageRating: reviews.length
        ? Math.round(
            (reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
              reviews.length) *
              10,
          ) / 10
        : 0,
    },

    questions,

    reviews,
  };
};

// get courses analytics monthly , statistics  for specific organization
export const getMyOrganizationCoursesAnalyticsService = async (
  instructorId: string,
  year?: number,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  const organization = await getMyOrganizationService(instructorId);

  return getOrganizationCoursesAnalyticsService(
    organization._id.toString(),
    year,
  );
};

// get orders analytics monthly , statistics  for specific organization
export const getMyOrganizationOrdersAnalyticsService = async (
  instructorId: string,
  year?: number,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  const organization = await getMyOrganizationService(instructorId);

  return getOrganizationOrdersAnalyticsService(
    organization._id.toString(),
    year,
  );
};

// get organization details with pagination courses for admin
export const getOrganizationDetailsService = async (
  id: string,
  queryString: Record<string, any>,
) => {
  validateId(id);

  const organization = await OrganizationModel.findById(id).populate(
    "instructor",

    "name email avatar role status createdAt",
  );

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  const features = new ApiFeatures(
    CourseModel.find({ organization: id }).select(
      "name description price estimatePrice thumbnail level status ratings purchased reviewsCount totalLectures createdAt updatedAt",
    ),

    queryString,
  )

    .filter([
      "price",
      "estimatePrice",
      "level",
      "status",
      "ratings",
      "purchased",
      "reviewsCount",
      "totalLectures",
    ])

    .search(["name", "description"])

    .sort([
      "price",
      "estimatePrice",
      "ratings",
      "purchased",
      "reviewsCount",
      "totalLectures",
      "createdAt",
    ]);

  const total = await features.query.clone().countDocuments();

  features.paginate();

  const courses = await features.query;

  const pagination = features.getPagination(total);

  return {
    organization,

    result: courses.length,

    pagination,

    courses,
  };
};

const CERTIFICATE_SORT_FIELDS = [
  "learningHours",
  "issuedAt",
  "studentName",
  "courseTitle",
];
// get certificates for specific organization for instructor with pagaintion
export const getOrganizationCertificatesForInstructorService = async (
  instructorId: string,
  queryString: Record<string, any>,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  const organization = await getMyOrganizationService(instructorId);

  const search =
    typeof queryString.search === "string" ? queryString.search.trim() : "";

  const query = {
    ...queryString,
    search,
  };

  const certificatesQuery = CertificateModel.find({
    organization: organization._id,
  })
    .populate("user", "name email avatar")
    .populate("course", "name thumbnail");

  const features = new ApiFeatures(certificatesQuery, query)
    .filter(["learningHours"])
    .search(["studentName", "courseTitle"])
    .sort(CERTIFICATE_SORT_FIELDS);

  const total = await features.query.clone().countDocuments();

  // org-wide certificate counters repeat on every page/search
  const certStatsKey = orgCertStatsKey(String(organization._id));

  const cachedCertStats = await getCached<any>(certStatsKey);

  let stats: {
    totalCertificates: number;
    totalStudents: number;
    totalCourses: number;
    totalLearningHours: number;
  };

  if (cachedCertStats) {
    stats = cachedCertStats;
  } else {
    const [statsRow] = await CertificateModel.aggregate([
      { $match: { organization: organization._id } },
      {
        $group: {
          _id: null,
          totalCertificates: { $sum: 1 },
          totalStudents: { $addToSet: "$user" },
          totalCourses: { $addToSet: "$course" },
          totalLearningHours: { $sum: "$learningHours" },
        },
      },
    ]);

    stats = {
      totalCertificates: statsRow?.totalCertificates ?? 0,
      totalStudents: statsRow?.totalStudents?.length ?? 0,
      totalCourses: statsRow?.totalCourses?.length ?? 0,
      totalLearningHours: statsRow?.totalLearningHours ?? 0,
    };

    await setCached(certStatsKey, stats, ORG_CERT_STATS_TTL);
  }

  features.paginate();

  const certificates = await features.query;

  return {
    organization,
    result: certificates.length,
    stats,
    pagination: features.getPagination(total),
    certificates,
  };
};

// get all sertificates for admin with pagination
export const getAllCertificatesAdminService = async (
  queryString: Record<string, any>,
) => {
  const search =
    typeof queryString.search === "string" ? queryString.search.trim() : "";

  const query = {
    ...queryString,
    search: search ? escapeRegex(search) : "",
  };

  const certificatesQuery = CertificateModel.find()
    .populate("user", "name email avatar")
    .populate("course", "name thumbnail")
    .populate("organization", "name");

  const features = new ApiFeatures(certificatesQuery, query)
    .filter(["learningHours"])
    .search(["studentName", "courseTitle"])
    .sort(CERTIFICATE_SORT_FIELDS);

  const total = await features.query.clone().countDocuments();

  const [stats] = await CertificateModel.aggregate([
    {
      $group: {
        _id: null,
        totalCertificates: { $sum: 1 },
        totalStudents: { $addToSet: "$user" },
        totalCourses: { $addToSet: "$course" },
        totalLearningHours: { $sum: "$learningHours" },
      },
    },
  ]);

  features.paginate();

  const certificates = await features.query;

  return {
    result: certificates.length,
    stats: {
      totalCertificates: stats?.totalCertificates ?? 0,
      totalStudents: stats?.totalStudents?.length ?? 0,
      totalCourses: stats?.totalCourses?.length ?? 0,
      totalLearningHours: stats?.totalLearningHours ?? 0,
    },
    pagination: features.getPagination(total),
    certificates,
  };
};

// updated organization
export const updateOrganizationService = async (
  id: string,
  payload: {
    name?: string;
    status?: "active" | "suspended";
  },
) => {
  validateId(id);

  const organization = await OrganizationModel.findById(id);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  if (payload.name !== undefined) {
    const name = payload.name.trim();

    if (!name) {
      throw new AppError("Organization name is required", 400);
    }

    organization.name = name;
    organization.slug = slugify(name);
  }

  if (payload.status !== undefined) {
    organization.status = payload.status;
  }

  await organization.save();

  await invalidateOrgCachesByInstructor(String(organization.instructor));

  return organization;
};

// get  courses analytics chart monthly and staistisc for specific organization fro admin
export const getOrganizationCoursesAnalyticsService = async (
  id: string,
  year?: number,
) => {
  validateId(id);

  const organization = await OrganizationModel.findById(id).select("_id name");

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  if (!year || !Number.isInteger(year)) {
    throw new AppError("A valid year is required", 400);
  }

  // yearly analytics are bounded by the calendar, so the org/year keyspace is
  // finite; a 5m ttl keeps the admin charts snappy without intensive rewrites
  const cacheKey = orgCoursesAnalyticsKey(id, year);

  const cachedAnalytics = await getCached<any>(cacheKey);

  if (cachedAnalytics) {
    return cachedAnalytics;
  }

  const startOfYear = new Date(Date.UTC(year, 0, 1));

  const startOfNextYear = new Date(Date.UTC(year + 1, 0, 1));

  const filter = { organization: new Types.ObjectId(id) };

  const [totalCourses, coursesCreated, statistics, monthly] = await Promise.all(
    [
      CourseModel.countDocuments(filter),

      CourseModel.countDocuments({
        ...filter,

        createdAt: {
          $gte: startOfYear,

          $lt: startOfNextYear,
        },
      }),

      CourseModel.aggregate([
        { $match: filter },

        {
          $group: {
            _id: null,

            totalPurchases: { $sum: "$purchased" },

            averageRating: { $avg: "$ratings" },
          },
        },
      ]),

      getMonthlyAnalytics(CourseModel, year, filter),
    ],
  );

  const totalPurchases = statistics[0]?.totalPurchases ?? 0;

  const averageRating = statistics[0]?.averageRating
    ? Number(statistics[0].averageRating.toFixed(1))
    : 0;

  const coursesAnalytics = {
    statistics: {
      totalCourses,

      coursesCreated,

      totalPurchases,

      averageRating,
    },

    monthly,
  };

  await setCached(cacheKey, coursesAnalytics, ORG_ANALYTICS_TTL);

  return coursesAnalytics;
};

// get  orders analytics chart monthly and staistisc for specific organization fro admin
export const getOrganizationOrdersAnalyticsService = async (
  id: string,

  year?: number,
) => {
  validateId(id);

  const organization = await OrganizationModel.findById(id).select("_id name");

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  if (!year || !Number.isInteger(year)) {
    throw new AppError("A valid year is required", 400);
  }

   const cacheKey = orgOrdersAnalyticsKey(id, year);

  const cachedAnalytics = await getCached<any>(cacheKey);

  if (cachedAnalytics) {
    return cachedAnalytics;
  }

  const startOfYear = new Date(Date.UTC(year, 0, 1));

  const startOfNextYear = new Date(Date.UTC(year + 1, 0, 1));

  const filter = { organization: new Types.ObjectId(id) };

  const [
    totalOrders,

    newOrders,

    totalRevenueResult,

    yearlyRevenueResult,

    monthly,
  ] = await Promise.all([
    OrderModel.countDocuments(filter),

    OrderModel.countDocuments({
      ...filter,

      createdAt: {
        $gte: startOfYear,

        $lt: startOfNextYear,
      },
    }),

    OrderModel.aggregate([
      { $match: filter },

      {
        $group: {
          _id: null,

          totalRevenue: { $sum: "$price" },
        },
      },
    ]),

    OrderModel.aggregate([
      {
        $match: {
          ...filter,

          createdAt: {
            $gte: startOfYear,

            $lt: startOfNextYear,
          },
        },
      },

      {
        $group: {
          _id: null,

          yearlyRevenue: { $sum: "$price" },
        },
      },
    ]),

    getMonthlyAnalytics(OrderModel, year, filter),
  ]);

  const totalRevenue = totalRevenueResult[0]?.totalRevenue ?? 0;

  const yearlyRevenue = yearlyRevenueResult[0]?.yearlyRevenue ?? 0;

  const ordersAnalytics = {
    statistics: {
      totalOrders,

      newOrders,

      totalRevenue,

      yearlyRevenue,
    },

    monthly,
  };

  await setCached(cacheKey, ordersAnalytics, ORG_ANALYTICS_TTL);

  return ordersAnalytics;
};

// get instructor for admin
export const getOrganizationInstructorService = async (id: string) => {
  validateId(id);

  const organization = await OrganizationModel.findById(id).select(
    "_id name instructor",
  );

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  const instructor = await UserModel.findById(organization.instructor).select(
    "name email avatar role status isVerified isDeleted createdAt updatedAt",
  );

  if (!instructor) {
    throw new AppError("Instructor not found", 404);
  }

  const coursesCount = await CourseModel.countDocuments({
    instructor: instructor._id,
  });

  return {
    instructor,

    coursesCount,
  };
};

// delete organization for admin
export const deleteOrganizationService = async (id: string) => {
  validateId(id);

  const organization = await OrganizationModel.findById(id);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  const deletedCourses = await CourseModel.deleteMany({ organization: id });

  await OrganizationModel.findByIdAndDelete(id);

  await invalidateOrgCachesByInstructor(String(organization.instructor));

  return {
    id,
    name: organization.name,
    deletedCourses: deletedCourses.deletedCount ?? 0,
  };
};

export const getMyOrganizationCourseService = async (
  instructorId: string,
  courseId: string,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  if (!courseId) {
    throw new AppError("Course ID is required", 400);
  }

  if (!isValidObjectId(courseId)) {
    throw new AppError("Invalid course ID", 400);
  }

  const organization = await getMyOrganizationService(instructorId);

  const cacheKey = courseCacheKeys.organization(
    String(organization._id),
    courseId,
  );

  const organizationSummary = {
    _id: organization._id,
    name: organization.name,
    slug: organization.slug,
  };

  const cached = await getCached<{ course: unknown; category: unknown }>(
    cacheKey,
  );

  if (cached) {
    return {
      organization: organizationSummary,
      course: cached.course,
      category: cached.category,
    };
  }

  const course = await CourseModel.findOne({
    _id: new Types.ObjectId(courseId),
    organization: organization._id,
  }).lean();

  if (!course) {
    throw new AppError("Course not found in your organization", 404);
  }

  const category = course.category
    ? await CategoryModel.findById(course.category).select("title slug").lean()
    : null;

  await setCached(cacheKey, { course, category }, COURSE_CACHE_TTL);

  return {
    organization: organizationSummary,
    course,
    category,
  };
};
