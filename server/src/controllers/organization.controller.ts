import { NextFunction, Request, Response } from "express";
import ApiFeatures from "../utils/apiFeatures";
import AppError from "../utils/AppError";
import OrganizationModel from "../models/organization.model";
import CourseModel from "../models/course.model";
import { Types } from "mongoose";
import {
  deleteOrganizationService,
  getMyOrganizationCoursesAnalyticsService,
  getMyOrganizationDashboardStatisticsService,
  getMyOrganizationOrdersAnalyticsService,
  getMyOrganizationService,
  getOrganizationCoursesAnalyticsService,
  getOrganizationCoursesForInstructorService,
  getOrganizationDetailsService,
  getOrganizationInstructorService,
  getOrganizationOrdersAnalyticsService,
  getOrganizationOrdersForInstructorService,
  getOrganizationCertificatesForInstructorService,
  getOrganizationCourseDetailService,
  getOrganizationStudentProgressService,
  getOrganizationStudentsForInstructorService,
  updateOrganizationService,
  getMyOrganizationCoursesPerformanceService,
  getCourseOrdersLast12MonthsService,
  getMyOrganizationCourseService,

} from "../services/organization.service";
import {
  getMyOrganizationRecentEnrollmentsService,
  getMyOrganizationRecentReviewsService,
} from "../services/organization.activity.service";

export const getAllOrganizations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const queryString = req.query;
    const query = OrganizationModel.find().populate(
      "instructor",
      "name email avatar",
    );
    const features = new ApiFeatures(query, queryString)
      .search(["name"])
      .filter(["status"]);

    const total = await features.query.clone().countDocuments();

    features.paginate();

    const organizations = await features.query;

    const courseCounts = await CourseModel.aggregate([
      {
        $match: {
          organization: {
            $in: organizations.map((organization) => organization._id),
          },
        },
      },
      { $group: { _id: "$organization", count: { $sum: 1 } } },
    ]);

    const courseCountMap = new Map(
      courseCounts.map((item) => [item._id.toString(), item.count]),
    );

    const organizationsWithCourseCount = organizations
      .map((organization) => organization.toObject())
      .map((organization) => ({
        ...organization,
        coursesCount: courseCountMap.get(organization._id.toString()) ?? 0,
      }));

    const pagination = features.getPagination(total);

    res.status(200).json({
      success: true,
      result: organizations.length,
      pagination,
      organizations: organizationsWithCourseCount,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organizationId = req.params.id.toString();

    const { name, status } = req.body ?? {};

    const organization = await updateOrganizationService(organizationId, {
      name,
      status,
    });

    res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      organization,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organizationId = req.params.id.toString();

    const result = await deleteOrganizationService(organizationId);

    res.status(200).json({
      success: true,
      ...result,
      message: `${result.name} was deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrganizationCoursesPerformance = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instructorId = req.user!._id.toString();

    const page = req.query.page ? Number(req.query.page) : 1;

    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const { organization, result, statistics, pagination } =
      await getMyOrganizationCoursesPerformanceService(
        instructorId,
        page,
        limit,
      );

    res.status(200).json({
      success: true,
      organization,
      result,
      statistics,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrganizationCourseOrdersAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courseId = req.query.courseId as string;

    if (!courseId) {
      throw new AppError("Course ID is required", 400);
    }

    if (!Types.ObjectId.isValid(courseId)) {
      throw new AppError("Invalid course ID", 400);
    }

    let organizationId: string;

    if (req.user!.role === "admin") {
  
      const course = await CourseModel.findById(courseId)
        .select("organization")
        .lean();

      if (!course) {
        throw new AppError("Course not found", 404);
      }

      organizationId = String(course.organization);
    } else {
      
      const instructorId = req.user!._id.toString();

      const organization = await getMyOrganizationService(instructorId);

      organizationId = String(organization._id);
    }

    const { course, totalOrders, totalRevenue, monthly } =
      await getCourseOrdersLast12MonthsService(courseId, organizationId);

    res.status(200).json({
      success: true,
      course,
      totalOrders,
      totalRevenue,
      monthly,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrganizationCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instructorId = req.user!._id.toString();

    const courseId = req.params.courseId.toString();

    const { organization, course, category } =
      await getMyOrganizationCourseService(instructorId, courseId);

    res.status(200).json({
      success: true,
      organization,
      category,
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrganizationRecentEnrollments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instructorId = req.user!._id.toString();

    const top = req.query.top ? Number(req.query.top) : 5;

    const { organization, result, enrollments } =
      await getMyOrganizationRecentEnrollmentsService(instructorId, top);

    res.status(200).json({
      success: true,
      organization,
      result,
      enrollments,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrganizationRecentReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instructorId = req.user!._id.toString();

    const top = req.query.top ? Number(req.query.top) : 5;

    const { organization, result, reviews } =
      await getMyOrganizationRecentReviewsService(instructorId, top);

    res.status(200).json({
      success: true,
      organization,
      result,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrganizationDashboardStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instructorId = req.user!._id.toString();

    const { organization, statistics } =
      await getMyOrganizationDashboardStatisticsService(instructorId);

    res.status(200).json({
      success: true,
      organization,
      statistics,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationCoursesAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organizationId = req.params.id.toString();

    const year = req.query.year ? Number(req.query.year) : undefined;

    const data = await getOrganizationCoursesAnalyticsService(
      organizationId,
      year,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationOrdersAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organizationId = req.params.id.toString();

    const year = req.query.year ? Number(req.query.year) : undefined;

    const data = await getOrganizationOrdersAnalyticsService(
      organizationId,
      year,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrganizationCoursesAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instructorId = req.user!._id.toString();

    const year = req.query.year ? Number(req.query.year) : undefined;

    const data = await getMyOrganizationCoursesAnalyticsService(
      instructorId,
      year,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrganizationOrdersAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instructorId = req.user!._id.toString();

    const year = req.query.year ? Number(req.query.year) : undefined;

    const data = await getMyOrganizationOrdersAnalyticsService(
      instructorId,
      year,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organizationId = req.params.id.toString();

    const data = await getOrganizationInstructorService(organizationId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instructorId = req.user!._id.toString();

    const organization = await getMyOrganizationService(instructorId);

    res.status(200).json({
      success: true,
      organization,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationCourses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organizationId = req.params.id.toString();
    const instructorId = req.user!._id.toString();

    const { result, pagination, courses } =
      await getOrganizationCoursesForInstructorService(
        organizationId,
        instructorId,
        req.query,
      );

    res.status(200).json({
      success: true,
      result,
      pagination,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instructorId = req.user!._id.toString();

    const { organization, result, summary, pagination, orders } =
      await getOrganizationOrdersForInstructorService(instructorId, req.query);

    res.status(200).json({
      success: true,
      organization,
      result,
      summary,
      pagination,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instructorId = req.user!._id.toString();

    const { organization, result, summary, pagination, students } =
      await getOrganizationStudentsForInstructorService(
        instructorId,
        req.query,
      );

    res.status(200).json({
      success: true,
      organization,
      result,
      summary,
      pagination,
      students,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationStudentProgress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instructorId = req.user!._id.toString();

    const { organization, student, summary, courses } =
      await getOrganizationStudentProgressService(
        instructorId,
        String(req.params.studentId),
      );

    res.status(200).json({
      success: true,
      organization,
      student,
      summary,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationCourseDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instructorId = req.user!._id.toString();

    const result = await getOrganizationCourseDetailService(
      instructorId,
      String(req.params.courseId),
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationCertificates = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instructorId = req.user!._id.toString();

    const { organization, result, stats, pagination, certificates } =
      await getOrganizationCertificatesForInstructorService(
        instructorId,
        req.query,
      );

    res.status(200).json({
      success: true,
      organization,
      result,
      stats,
      pagination,
      certificates,
    });
  } catch (error) {
    next(error);
  }
};
export const getOrganizationDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organizationId = req.params.id.toString();

    const { organization, result, pagination, courses } =
      await getOrganizationDetailsService(organizationId, req.query);

    res.status(200).json({
      success: true,
      organization,
      result,
      pagination,
      courses,
    });
  } catch (error) {
    next(error);
  }
};
