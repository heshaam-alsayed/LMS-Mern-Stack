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
    const courses = await courseService.getAllCourses();
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// get content course by user for purchased
export const getContentCourseByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const coursesUserList: Types.ObjectId[] = req.user?.courses || [];
    const courseId = req.params.id.toString();
    const content = await courseService.getCourseByUser(
      courseId,
      coursesUserList,
    );
    res.status(200).json({
      success: true,
      content,
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
    const userData: IUser = req?.user as IUser;
    const course = await courseService.addQuestion(data, userData);
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
    const userData: IUser = req?.user as IUser;

    const course = await courseService.addAnswer(data, userData);
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
    const userData: IUser = req?.user as IUser;
    const coursesUserList: Types.ObjectId[] = req.user?.courses || [];
    const courseId = req.params.id.toString();

    const course = await courseService.addReviewCourse(
      courseId,
      data,
      coursesUserList,
      userData,
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
    const userData: IUser = req?.user as IUser;
    const course = await courseService.addReplyReview(data, userData);
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
