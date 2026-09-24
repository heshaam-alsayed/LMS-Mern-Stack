import { NextFunction, Request, response, Response } from "express";
import courseService from "../services/course.service";
import { Types } from "mongoose";
import {
  IAddQuestionData,
  IAddReplyReviewData,
  IAddReviewData,
  IAnswerData,
} from "../interfaces/courseInterface";
import { IUser } from "../interfaces/userInterface";
import { getMonthlyAnalytics } from "../utils/analytics";
import CourseModel from "../models/course.model";
import axios from "axios";
import ApiFeatures from "../utils/apiFeatures";
import AppError from "../utils/AppError";
import { getAllCategoriesService } from "../services/category.service";
import { getCourseProgressService } from "../services/courseProgress.service";

export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;
    const course = await courseService.createCourse(data);
    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courseId = req.params.id.toString();
    const data = req.body;
    const course = await courseService.updateCourse(courseId, data);
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// get public course for not purchased
export const getPublicCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courseId = req.params.id.toString();
    const course = await courseService.getPublicCourse(courseId);
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courseId = req.params.id.toString();
    const course = await courseService.getAdminCourse(courseId);
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// get all public courses not purchased
export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await courseService.getAllCourses(req.query);
    res.status(200).json({
      success: true,
      result: result.courses.length,
      pagination: result.pagination,
      courses: result.courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getContentCourseByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id.toString() as string;
    const courseId = req.params.id.toString() as string;

    const course = await courseService.getCourseByUser(courseId, userId);
    const progress = await getCourseProgressService(userId, courseId);
    res.status(200).json({
      success: true,
      course,
      progress,
    });
  } catch (error) {
    next(error);
  }
};

export const addQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: IAddQuestionData = req.body;
    const userId = req.user?._id;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const course = await courseService.addQuestion(data, userId.toString());
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const addAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: IAnswerData = req.body;
    const userId = req?.user?._id;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const course = await courseService.addAnswer(data, userId.toString());
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const addReviewCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: IAddReviewData = req.body;
    const userId = req.user?._id;
    const courseId = req.params.id.toString();
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const course = await courseService.addReviewCourse(
      courseId,
      data,
      userId.toString(),
    );
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const addReplyReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: IAddReplyReviewData = req.body;
    const userId = req.user?._id;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const course = await courseService.addReplyReview(data, userId.toString());
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log(req.query);
    const features = new ApiFeatures(
      CourseModel.find().select(
        "name description price estimatePrice thumbnail level ratings purchased createdAt updatedAt",
      ),
      req.query,
    )
      .filter(["price", "estimatePrice", "level", "ratings", "purchased"])
      .search(["name", "description", "tags"])
      .sort(["price", "estimatePrice", "ratings", "purchased", "createdAt"]);

    // Get total BEFORE pagination
    const total = await features.query.clone().countDocuments();

    // Apply pagination
    features.paginate();

    // Get courses
    const courses = await features.query;

    const pagination = features.getPagination(total);

    res.status(200).json({
      success: true,
      result: courses.length,
      pagination,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyCoursesAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const year = req.query.year ? Number(req.query.year) : undefined;
    console.log(year);
    const data = await getMonthlyAnalytics(CourseModel, year);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getCoursePurchases = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courseId = req.params.id.toString();
    const course = await courseService.getCoursePurchases(courseId);
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCoursesPurchases = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const course = await courseService.getAllCoursesPurchases();
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopSellingCourses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = Number(req.query.limit);

    const courses = await courseService.getTopSellingCourses(limit);
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

export const generateVideoUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { videoId } = req.body;
    console.log(videoId);
    const response = await axios.post(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      { ttl: 300 },
      {
        headers: {
          Accept: "Application/json",
          "Content-Type": "Application/json",
          Authorization: `Apisecret ${process.env.VIDEO_CIPHER_API_SECRET}`,
        },
      },
    );
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

export const getCoursesStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const year = Number(req.query.year);

    if (!year || !Number.isInteger(year)) {
      return res.status(400).json({
        success: false,
        message: "A valid year is required",
      });
    }

    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);
    console.log(startOfYear, startOfNextYear);
    const [totalCourses, coursesCreated, statistics] = await Promise.all([
      // Total courses
      CourseModel.countDocuments(),

      // Courses created in selected year
      CourseModel.countDocuments({
        createdAt: {
          $gte: startOfYear,
          $lt: startOfNextYear,
        },
      }),

      // Purchases + average rating
      CourseModel.aggregate([
        {
          $group: {
            _id: null,
            totalPurchases: {
              $sum: "$purchased",
            },
            averageRating: {
              $avg: "$ratings",
            },
          },
        },
      ]),
    ]);

    const totalPurchases = statistics[0]?.totalPurchases ?? 0;

    const averageRating = statistics[0]?.averageRating
      ? Number(statistics[0].averageRating.toFixed(1))
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalCourses,
        coursesCreated,
        totalPurchases,
        averageRating,
      },
    });
  } catch (error) {
    next(error);
  }
};



export const getOperationCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courseId = req.params.courseId as string
    const data = await courseService.getOperationCourse(courseId);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
