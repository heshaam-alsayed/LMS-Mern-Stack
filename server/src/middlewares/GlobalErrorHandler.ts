import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;

  // =========================
  // MONGODB / MONGOOSE ERRORS
  // =========================

  // CastError (invalid ObjectId)
  if (error?.name === "CastError") {
    const message = `Invalid ${error.path}: ${error.value}`;
    error = new AppError(message, 400);
  }

  // Duplicate key error
  if (error?.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    const message = `Duplicate field value: ${field}`;
    error = new AppError(message, 400);
  }

  // Validation error
  if (error?.name === "ValidationError") {
    const messages = Object.values(error.errors || {}).map(
      (el: any) => el.message,
    );

    const message = `Invalid input data: ${messages.join(". ")}`;
    error = new AppError(message, 400);
  }

  // =========================
  // JWT ERRORS
  // =========================

  if (error?.name === "JsonWebTokenError") {
    error = new AppError("Invalid token. Please login again", 401);
  }

  if (error?.name === "TokenExpiredError") {
    error = new AppError("Token expired. Please login again", 401);
  }

  // =========================
  // DEFAULT SETUP
  // =========================

  const statusCode = error.statusCode || 500;
  const status = error.status || "error";

  const isDev = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    status,
    message: error.message,

    // 🔥 show stack ONLY in development
    stack: isDev ? error.stack : undefined,
  });
};
