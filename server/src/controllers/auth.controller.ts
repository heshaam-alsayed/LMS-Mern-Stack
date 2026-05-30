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
    const token = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Check Your email to verification Account",
      token,
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
    await authService.activateUser(req.body);
    res.status(201).json({
      success: true,
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

    await sendToken(user, res);

    res.status(200).json({
      success: true,
      user,
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

    res.cookie("access_token", accessToken, accessCookieOptions);
    res.cookie("refresh_token", newRefreshToken, refreshCookieOptions);

    res.status(200).json({
      success: true,
      accessToken,
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
    const user = await authService.handleSocialAuth(req.body, res);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};


