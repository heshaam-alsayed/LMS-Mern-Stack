import express, { NextFunction, Request, Response } from "express";
export const app = express();
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/GlobalErrorHandler";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import layoutRouter from "./routes/layout.route";
import categoryRouter from "./routes/category.route";

dotenv.config();

app.set("query parser", "extended");
//body parser middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

//cors middleware
const allowedOrigins = process.env.ORIGIN?.split(",");
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/layouts", layoutRouter);
app.use("/api/v1/categories", categoryRouter);

app.all(/.*/, (req: Request, res: Response) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(globalErrorHandler);
