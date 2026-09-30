import {
  Request,
  Response,
  NextFunction,
} from "express";
import { generateCertificateService, getCertificateService } from "../services/certificate.service";



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