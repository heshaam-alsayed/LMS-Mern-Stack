import { NextFunction, Request, Response } from "express";

import layoutService from "../services/layout.service";
import { LayoutType } from "../interfaces/layoutInterface";
import UserModel from "../models/user.model";
import CourseModel from "../models/course.model";
import CertificateModel from "../models/certificate.model";
import { getCached, setCached } from "../utils/redis";

const HERO_STATS_CACHE_KEY = "stats:hero";
const HERO_STATS_TTL = 60;

export const getAllLayouts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("GET ALL LAYOUTS");

    const layouts = await layoutService.getAllLayouts();

    console.log("LAYOUTS:", layouts);

    res.status(200).json({
      success: true,
      count: layouts.length,
      layouts,
    });
  } catch (error) {
    console.error("GET ALL LAYOUTS ERROR:", error);
    next(error);
  }
};
export const createLayout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const layout = await layoutService.createLayout(req.body);

    res.status(201).json({
      success: true,
      layout,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLayout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const layout = await layoutService.updateLayout(req.body);

    res.status(201).json({
      success: true,
      layout,
    });
  } catch (error) {
    next(error);
  }
};

export const getLayoutByType = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("calling banner layout");
    const type = req?.params.type as LayoutType;

    const layout = await layoutService.getLayoutByType(type);

    res.status(200).json({
      success: true,
      layout,
    });
  } catch (error) {
    next(error);
  }
};

export const getHeroStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // same four integers for every visitor, the counter cache is decorative
    // (30-60s lag is invisible); a 60s ttl avoids any invalidation surface
    const cachedStats = await getCached<{
      totalStudents: number;
      totalCourses: number;
      totalCertificates: number;
      totalEnrollments: number;
    }>(HERO_STATS_CACHE_KEY);

    if (cachedStats) {
      res.status(200).json({
        success: true,
        stats: cachedStats,
      });

      return;
    }

    const [totalStudents, totalCourses, totalCertificates, enrollmentResult] =
      await Promise.all([
        UserModel.find({ role: "user" }).countDocuments(),
        CourseModel.countDocuments(),
        CertificateModel.countDocuments(),
        UserModel.aggregate([
          {
            $match: {
              role: "user",
            },
          },
          {
            $unwind: "$courses",
          },
          {
            $count: "totalEnrollments",
          },
        ]),
      ]);
    const totalEnrollments = enrollmentResult[0]?.totalEnrollments ?? 0;

    const stats = {
      totalStudents,
      totalCourses,
      totalCertificates,
      totalEnrollments,
    };

    await setCached(HERO_STATS_CACHE_KEY, stats, HERO_STATS_TTL);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};
