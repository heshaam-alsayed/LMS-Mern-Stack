import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/AppError";
import redis from "../utils/redis";

interface IDecoded extends JwtPayload {
  id: string;
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return next(
        new AppError("invalid token, or Expired Please login again", 401),
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as IDecoded;

    if (!decoded?.id) {
      return next(new AppError("Invalid token please login again", 401));
    }

    const session = await redis.get(decoded.id);

    if (!session) {
      return next(new AppError("Session expired please login again", 401));
    }

    req.user = JSON.parse(session);

    next();
  } catch (error) {
    next(new AppError("Not authenticated", 401));
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403,
        ),
      );
    }

    next();
  };
};
