import {
  Request,
  Response,
  NextFunction,
} from "express";
import { generateCertificateService, getCertificateService } from "../services/certificate.service";
import { getAllCertificatesAdminService } from "../services/organization.service";

export const generateCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req?.user?._id.toString() ?? "";

    const  courseId  = req.params.courseId as string;

    const certificate =
      await generateCertificateService(
        userId,
        courseId,
      );

    res.status(201).json({
      success: true,
      message:
        "Certificate generated successfully",

      certificate,
    });
  } catch (error) {
    next(error);
  }
};

export const getCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req?.user?._id.toString() ?? "";

    const  courseId  = req.params.courseId as string;

    const certificate =
      await getCertificateService(
        userId,
        courseId,
      );

    res.status(200).json({
      success: true,
      certificate,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCertificates = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { result, stats, pagination, certificates } =
      await getAllCertificatesAdminService(req.query);

    res.status(200).json({
      success: true,
      result,
      stats,
      pagination,
      certificates,
    });
  } catch (error) {
    next(error);
  }
};