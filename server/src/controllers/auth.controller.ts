import { NextFunction, Request, Response } from "express";
import authService from "../services/auth.service";
import {
  accessCookieOptions,
  handleRefreshAccessToken,
  refreshCookieOptions,
  sendToken,
} from "../utils/jwt";
import redis from "../utils/redis";

export const registrationUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const verificationToken = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "Check your email to verify your account",
      verificationToken,
    });
  } catch (error) {
    next(error);
  }
};

export const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log(req.body);
    await authService.activateUser(req.body);
    res.status(201).json({
      success: true,
      message: "Email Activation successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.login(req.body);

    const { accessToken, refreshToken } = await sendToken(user);
    const { password, ...userWithoutPassword } = user.toObject();

    res.cookie("access_token", accessToken, accessCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshCookieOptions);
    res.status(200).json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });
    const userId = req.user?._id.toString() || "";
    await redis.del(userId);
    res.status(200).json({
      success: true,
      message: "logout successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const oldRefreshToken = req.cookies.refresh_token;
    const { accessToken, newRefreshToken } =
      await handleRefreshAccessToken(oldRefreshToken);

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
};

export const socialAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("socialAuth called with body:", req.body);
    const { user, accessToken, refreshToken } =
      await authService.handleSocialAuth(req.body);

    res.status(200).json({
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};
