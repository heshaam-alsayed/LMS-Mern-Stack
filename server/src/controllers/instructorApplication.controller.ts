import { NextFunction, Request, Response } from "express";
import {
  approveInstructorApplicationService,
  createInstructorApplicationService,
  getAllOrganizationApplicationsService,
  getOrganizationApplicationByEmail,
  getOrganizationApplicationById,
  rejectInstructorApplicationService,
} from "../services/instructorApplication.service";

export const createInstructorApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const application = await createInstructorApplicationService(req.body);

    res.status(201).json({
      success: true,
      message: "Organization application submitted successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.query;

    if (typeof email !== "string") {
      throw new Error("Email is required");
    }

    const application = await getOrganizationApplicationByEmail(email);

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrganizationApplications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, status } = req.query;

    const { applications, pagination } =
      await getAllOrganizationApplicationsService({
        page: typeof page === "string" ? page : undefined,
        limit: typeof limit === "string" ? limit : undefined,
        status: typeof status === "string" ? status : undefined,
      });

    res.status(200).json({
      success: true,
      applications,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationApplicationAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const application = await getOrganizationApplicationById(id.toString());
    return res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

export const approveInstructorApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const adminId = req.user?._id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const application = await approveInstructorApplicationService(
      id.toString(),
      adminId.toString(),
    );

    res.status(200).json({
      success: true,
      message: "Instructor application approved successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectInstructorApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const { rejectionReason } = req.body;

    const adminId = req.user?._id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const application = await rejectInstructorApplicationService(
      id.toString(),
      adminId.toString(),
      rejectionReason,
    );

    res.status(200).json({
      success: true,
      message: "Instructor application rejected successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};
