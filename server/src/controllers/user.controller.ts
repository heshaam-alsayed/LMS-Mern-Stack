import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import { getMonthlyAnalytics } from "../utils/analytics";
import UserModel from "../models/user.model";
import ApiFeatures from "../utils/apiFeatures";

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params?.id.toString();

    const user = await userService.getUserById(userId);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;
    await userService.createUser(body);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id.toString() || "";
    console.log(userId);

    const user = await userService.getMe(userId);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id.toString() || "";
    console.log(userId);
    const updatedUser = await userService.updateUserInfo(userId, req.body);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id.toString() || "";
    console.log(req.body.avatar);
    const updatedUser = await userService.updateAvatar(userId, req.body.avatar);

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id.toString() || "";
    console.log("Updating password for user:", userId);
    const user = await userService.updatePassword(userId, req.body);

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const features = new ApiFeatures(
      UserModel.find({ isDeleted: false }).select("-password"),
      req.query,
    )
      .filter(["role", "isVerified"])
      .search(["name", "email"])
      .sort(["createdAt", "name"]);

    const total = await features.query.clone().countDocuments();

    features.paginate();

    const users = await features.query;
    const pagination = features.getPagination(total);
    res.status(200).json({
      success: true,
      result: users.length,
      pagination,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const changeRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, role } = req.body;
    const updatedUser = await userService.changeRole(id, role);
    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleUserDeleted = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id as string;

    const result = await userService.toggleUserDeleted(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyUsersAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const year = req.query.year ? Number(req.query.year) : undefined;

    const data = await getMonthlyAnalytics(UserModel, year);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};


export const getUsersStatistics = async (
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

    const [
      totalUsers,
      newUsers,
      usersWithCourses,
      deletedUsers,
    ] = await Promise.all([
      // Total users
      UserModel.countDocuments({
        isDeleted: false,
      }),

      // Users created in selected year
      UserModel.countDocuments({
        createdAt: {
          $gte: startOfYear,
          $lt: startOfNextYear,
        },
      }),

      // Users who have at least one course
      UserModel.countDocuments({
        courses: {
          $exists: true,
          $ne: [],
        },
      }),

      // Deleted users
      UserModel.countDocuments({
        isDeleted: true,
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        newUsers,
        usersWithCourses,
        deletedUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};