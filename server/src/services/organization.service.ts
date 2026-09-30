import { isValidObjectId, PipelineStage, Types } from "mongoose";

import CertificateModel from "../models/certificate.model";
import CategoryModel from "../models/category.model";
import CourseModel from "../models/course.model";

import CourseProgressModel from "../models/courseProgress.model";

import OrderModel from "../models/order.model";
import OrganizationModel from "../models/organization.model";

import UserModel from "../models/user.model";

import ApiFeatures from "../utils/apiFeatures";

import redis from "../utils/redis";

import { COURSE_CACHE_TTL, courseCacheKeys } from "../utils/courseCache";

import { getMonthlyAnalytics } from "../utils/analytics";

import AppError from "../utils/AppError";

import { slugify } from "../utils/helper";

const VALID_STATUSES = ["active", "suspended"];

// only what the order modal renders
const USER_ORDER_FIELDS = "name email phone status avatar";

const COURSE_ORDER_FIELDS =
  "name category status price ratings purchased level thumbnail";

const validateId = (id: string) => {
  if (!id) {
    throw new AppError("Organization ID is required", 400);
  }

  if (!isValidObjectId(id)) {
    throw new AppError("Invalid organization ID", 400);
  }
};

export const getMyOrganizationService = async (instructorId: string) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  const organization = await OrganizationModel.findOne({
    instructor: instructorId,
  })

    .select("_id name slug description status createdAt updatedAt")

    .lean();

  if (!organization) {
    throw new AppError("No organization is linked to this account", 404);
  }

  return organization;
};

export const getMyOrganizationDashboardStatisticsService = async (
  instructorId: string,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  const organization = await getMyOrganizationService(instructorId);

  const filter = {
    organization: organization._id,
  };

  const [totalCourses, totalOrders, totalStudents, certificateStats] =
    await Promise.all([
      CourseModel.countDocuments(filter),

      OrderModel.countDocuments(filter),

      OrderModel.distinct("user", filter),

      CertificateModel.aggregate([
        { $match: filter },
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

  return {
    organization,

    statistics: {
      totalStudents: totalStudents.length,
      totalCourses,
      totalOrders,
      totalCertificates: certificateStats[0]?.totalCertificates ?? 0,
      totalLearningHours: Number(totalLearningHours.toFixed(1)),
    },
  };
};

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

  const skip = (currentPage - 1) * currentLimit;

  const filter = { organization: organization._id };

  const [courses, totalCourses, orderStats, progressStats] = await Promise.all([
    CourseModel.find(filter)
      .select("_id name ratings courseData")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(currentLimit)
      .lean(),

    CourseModel.countDocuments(filter),

    // grouped per course
    OrderModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$course",
        
          students: { $addToSet: "$user" },
          revenue: { $sum: "$price" },
        },
      },
    ]),

        CourseProgressModel.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      { $match: { "course.organization": organization._id } },
      {
        $project: {
          course: "$course._id",
          completedLectures: {
            $size: { $ifNull: ["$completedLectures", []] },
          },
          totalLectures: { $size: { $ifNull: ["$course.courseData", []] } },
        },
      },
      // a course without lectures can never be completed, so it is skipped
      { $match: { $expr: { $gt: ["$totalLectures", 0] } } },
      {
        $group: {
          _id: "$course",
          completedStudents: {
            $sum: {
              $cond: [
                { $gte: ["$completedLectures", "$totalLectures"] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),
  ]);

  const ordersByCourse = new Map(
    orderStats.map((row) => [String(row._id), row]),
  );

  const completedByCourse = new Map(
    progressStats.map((row) => [String(row._id), row.completedStudents]),
  );

  const statistics = courses.map((course) => {
    const orders = ordersByCourse.get(String(course._id));

    const totalStudents = orders?.students?.length ?? 0;

    const completedStudents = completedByCourse.get(String(course._id)) ?? 0;

    return {
      _id: course._id,
      course: course.name,
      students: totalStudents,
      revenue: orders?.revenue ?? 0,
      rating: course.ratings ?? 0,
      completion:
        totalStudents > 0
          ? Math.round((completedStudents / totalStudents) * 100)
          : 0,
    };
  });

  const totalPages = Math.ceil(totalCourses / currentLimit);

  return {
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
};

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

  // scoped to the organization, so a course id from another instructor returns
  // 404 instead of a chart full of zeros
  const course = await CourseModel.findOne({
    _id: courseId,
    organization: organizationId,
  })
    .select("_id name")
    .lean();

  if (!course) {
    throw new AppError("Course not found in your organization", 404);
  }

  const endDate = new Date();

  // first day of the month 11 months back, so the window covers 12 whole
  // calendar months
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

    // the day is pinned to 1 before moving the month. setMonth keeps the
    // day of month, so on the 29th it would roll "Feb 29" over to "Mar 1" in a
    // non leap year, which dropped February from the window entirely
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

  return {
    course: {
      _id: course._id,
      name: course.name,
    },
    totalOrders: result.reduce((total, item) => total + item.orders, 0),
    totalRevenue: result.reduce((total, item) => total + item.revenue, 0),
    monthly: result,
  };
};

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
      "name description price estimatePrice thumbnail level status ratings purchased createdAt updatedAt",
    ),

    queryString,
  )

    .filter(["price", "estimatePrice", "level", "status", "ratings", "purchased"])

    .search(["name", "description"])

    .sort(["price", "estimatePrice", "ratings", "purchased", "createdAt"]);

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

export const getOrganizationOrdersForInstructorService = async (
  instructorId: string,

  queryString: Record<string, any>,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  // the organization comes from the session, not the request

  const organization = await getMyOrganizationService(instructorId);

  const search =
    typeof queryString.search === "string" ? queryString.search.trim() : "";

  const baseQuery = OrderModel.find()

    .populate("user", USER_ORDER_FIELDS)

    .populate({
      path: "course",

      select: COURSE_ORDER_FIELDS,

      populate: {
        path: "category",
        select: "title slug",
      },
    });

  const features = new ApiFeatures(baseQuery, queryString)

    .filter(["price"])

    .sort(["price", "createdAt"]);

  const scope: Record<string, any> = {
    organization: organization._id,
  };

  if (search) {
    const pattern = escapeRegex(search);

    const [users, courses] = await Promise.all([
      UserModel.find({ name: { $regex: pattern, $options: "i" } }).select(
        "_id",
      ),

      CourseModel.find({ name: { $regex: pattern, $options: "i" } }).select(
        "_id",
      ),
    ]);

    const userIds = users.map((user) => user._id);

    const courseIds = courses.map((course) => course._id);

    if (!userIds.length && !courseIds.length) {
      scope._id = { $in: [] };
    } else {
      scope.$or = [
        ...(userIds.length ? [{ user: { $in: userIds } }] : []),

        ...(courseIds.length ? [{ course: { $in: courseIds } }] : []),
      ];
    }
  }

  features.query = features.query.merge(scope);

  const [summary] = await OrderModel.aggregate([
    { $match: features.query.clone().getFilter() },

    { $group: { _id: null, totalRevenue: { $sum: "$price" } } },
  ]);

  const total = await features.query.clone().countDocuments();

  features.paginate();

  const orders = await features.query;

  const pagination = features.getPagination(total);

  return {
    organization,

    result: orders.length,

    summary: {
      totalOrders: total,

      totalRevenue: summary?.totalRevenue ?? 0,
    },

    pagination,

    orders,
  };
};

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

  const requestedSort = String(queryString.sort || "");

  const sortKey = STUDENT_SORT_FIELDS[requestedSort]
    ? requestedSort
    : "-purchasedCount";

  const isDescending = sortKey.startsWith("-");

  const sortField = isDescending ? sortKey.slice(1) : sortKey;

  const sortDirection: SortDirection = isDescending ? -1 : 1;

  const sortStage: Record<string, SortDirection> =
    sortField === "name"
      ? { name: sortDirection }
      : {
          [sortField]: sortDirection,

          name: 1,
        };

  const result = await OrderModel.aggregate([
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

    {
      $lookup: {
        from: "users",

        localField: "_id",

        foreignField: "_id",

        as: "user",
      },
    },

    {
      $unwind: "$user",
    },

    {
      $match: {
        "user.isDeleted": false,
      },
    },

    ...(search
      ? [
          {
            $match: {
              "user.name": {
                $regex: escapeRegex(search),

                $options: "i",
              },
            },
          },
        ]
      : []),

    {
      $project: {
        _id: "$user._id",

        name: "$user.name",

        email: "$user.email",

        avatar: "$user.avatar",

        status: "$user.status",

        purchasedCount: 1,
      },
    },

    {
      $sort: sortStage,
    },

    {
      $facet: {
        students: [{ $skip: skip }, { $limit: limit }],

        total: [{ $count: "count" }],
      },
    },
  ]);

  const data = result[0];

  const students = data?.students ?? [];

  const total = data?.total?.[0]?.count ?? 0;

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

  // a student is someone who bought from this organization
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
      organization: organization._id,
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

/**
 * Full course workspace for the instructor: course info plus every question
 * and review raised on it. Scoped to the instructor's own organization.
 */
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
      "name description status price level ratings purchased thumbnail category tags createdAt updatedAt courseData reviews",
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

      totalLectures: (course.courseData ?? []).length,

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

export const getMyOrganizationCoursesAnalyticsService = async (
  instructorId: string,
  year?: number,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  // The organization is resolved from the logged in instructor instead of the
  // request, so an instructor can never read another organization's analytics.
  // The same aggregation used by the admin endpoint then runs on that id.
  const organization = await getMyOrganizationService(instructorId);

  return getOrganizationCoursesAnalyticsService(
    organization._id.toString(),
    year,
  );
};

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
      "name description price estimatePrice thumbnail level status ratings purchased createdAt updatedAt",
    ),

    queryString,
  )

    .filter(["price", "estimatePrice", "level", "status", "ratings", "purchased"])

    .search(["name", "description"])

    .sort(["price", "estimatePrice", "ratings", "purchased", "createdAt"]);

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

export const getOrganizationCertificatesForInstructorService = async (
  instructorId: string,
  queryString: Record<string, any>,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  // the organization is resolved from the logged in instructor, never from
  // the request, so a user can never read another organization's certificates
  const organization = await getMyOrganizationService(instructorId);

  // ApiFeatures passes the search value straight to $regex, so escape it here
  // to keep the search a literal match instead of a user supplied pattern
  const search =
    typeof queryString.search === "string" ? queryString.search.trim() : "";

  const query = {
    ...queryString,
    search: search ? escapeRegex(search) : "",
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

  const [stats] = await CertificateModel.aggregate([
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

  features.paginate();

  const certificates = await features.query;

  return {
    organization,
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

export const updateOrganizationService = async (
  id: string,

  payload: { name?: string; status?: string },
) => {
  validateId(id);

  const organization = await OrganizationModel.findById(id);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  const updateData: Record<string, any> = {};

  if (payload?.name !== undefined) {
    const name = payload.name.trim();

    if (!name) {
      throw new AppError("Organization name is required", 400);
    }

    if (name.length < 2 || name.length > 120) {
      throw new AppError(
        "Organization name must be between 2 and 120 characters",

        400,
      );
    }

    if (name !== organization.name) {
      const existingName = await OrganizationModel.findOne({
        name,

        _id: { $ne: id },
      });

      if (existingName) {
        throw new AppError("Organization name already exists", 409);
      }

      const slug = slugify(name);

      const existingSlug = await OrganizationModel.findOne({
        slug,

        _id: { $ne: id },
      });

      if (existingSlug) {
        throw new AppError("Organization slug already exists", 409);
      }

      updateData.name = name;

      updateData.slug = slug;
    }
  }

  if (payload?.status !== undefined) {
    const status = payload.status.trim().toLowerCase();

    if (!VALID_STATUSES.includes(status)) {
      throw new AppError("Invalid organization status", 400);
    }

    updateData.status = status;
  }

  if (!Object.keys(updateData).length) {
    throw new AppError("No valid fields to update", 400);
  }

  const updatedOrganization = await OrganizationModel.findByIdAndUpdate(
    id,

    updateData,

    { new: true, runValidators: true },
  ).populate("instructor", "name email avatar role status createdAt");

  if (!updatedOrganization) {
    throw new AppError("Organization not found", 404);
  }

  return updatedOrganization;
};

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

  return {
    statistics: {
      totalCourses,

      coursesCreated,

      totalPurchases,

      averageRating,
    },

    monthly,
  };
};

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

  return {
    statistics: {
      totalOrders,

      newOrders,

      totalRevenue,

      yearlyRevenue,
    },

    monthly,
  };
};

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

export const deleteOrganizationService = async (id: string) => {
  validateId(id);

  const organization = await OrganizationModel.findById(id);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  const deletedCourses = await CourseModel.deleteMany({ organization: id });

  await OrganizationModel.findByIdAndDelete(id);

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

  const cached = await redis.get(cacheKey);

  if (cached) {
    const parsed = JSON.parse(cached);

    return {
      organization: organizationSummary,
      course: parsed.course,
      category: parsed.category,
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
    ? await CategoryModel.findById(course.category)
        .select("title slug")
        .lean()
    : null;

  await redis.set(
    cacheKey,
    JSON.stringify({ course, category }),
    "EX",
    COURSE_CACHE_TTL,
  );

  return {
    organization: organizationSummary,
    course,
    category,
  };
};
