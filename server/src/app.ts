import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

import { globalErrorHandler } from "./middlewares/GlobalErrorHandler";

import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import layoutRouter from "./routes/layout.route";
import categoryRouter from "./routes/category.route";
import PaymentRouter from "./routes/payment.route";
import certificateRouter from "./routes/certificate.route";
import instructorApplicationRouter from "./routes/instructorApplication.route";
import organizationRouter from "./routes/organization.route";
import vdocipherRouter from "./routes/vdocipher.route";
import ticketRouter from "./routes/ticket.route";

dotenv.config();

export const app = express();

// Query parser
app.set("query parser", "extended");

// Render (and most hosts) terminate TLS and forward requests through a
// proxy. Without this every visitor appears as the same IP, so the rate
// limiter below would exhaust its budget globally and return 429.
app.set("trust proxy", 1);

// CORS
const envOrigins = (process.env.ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin?: string) => {
  if (!origin) return true; // non-browser / same-origin requests
  if (envOrigins.includes(origin)) return true;

  try {
    const hostname = new URL(origin).hostname;
    if (hostname === "localhost" && origin.includes("localhost")) return true;
    if (hostname.endsWith(".onrender.com")) return true;
    if (hostname.endsWith(".vercel.app")) return true;
  } catch {
    return false;
  }

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
    credentials: true,
  }),
);

// Rate Limiting
const limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});

app.use(limit);

// Stripe Webhook
// This route must receive the raw request body before express.json()
app.use(
  "/api/v1/payment/webhook",
  express.raw({
    type: "application/json",
  }),
);

// Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/layouts", layoutRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/payment", PaymentRouter);
app.use("/api/v1/certificates", certificateRouter);
app.use("/api/v1/instructor-applications", instructorApplicationRouter);
app.use("/api/v1/organizations", organizationRouter); 
app.use("/api/v1/vdocipher", vdocipherRouter);
app.use("/api/v1/tickets", ticketRouter);

// 404 - Route not found

app.all(/.*/, (req: Request, res: Response) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler MUST be the last middleware.

app.use(globalErrorHandler);