import express from "express";

import {
  addAnswer,
  addQuestion,
  addReplyReview,
  addReviewCourse,
  createCourse,
  generateVideoUrl,
  getAdminCourse,
  getAllCourses,
  getAllCoursesPurchases,
  getContentCourseByUser,
  getCoursePurchases,
  getCourses,
  getCoursesStatistics,
  getMonthlyCoursesAnalytics,
  getOperationCourse,
  getPublicCourse,
  getTopSellingCourses,
  updateCourse,
} from "../controllers/course.controller";

import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware";
import {
  completeLecture,
  getCourseProgress,
  getUserCoursesProgress,
  updateCurrentLecture,
} from "../controllers/courseProgress.controller";

const router = express.Router();

// Get all courses - Admin
router.get("/", isAuthenticated, authorizeRoles("admin"), getCourses);

// Get all public courses
router.get("/public-courses", getAllCourses);
// Create course - Admin
router.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  createCourse,
);

// Monthly courses analytics - Admin
router.get(
  "/monthly-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getMonthlyCoursesAnalytics,
);

router.get(
  "/analytics/statistics",
  isAuthenticated,
  authorizeRoles("admin"),
  getCoursesStatistics,
);

// Top selling courses - Admin
router.get(
  "/top-selling",
  isAuthenticated,
  authorizeRoles("admin"),
  getTopSellingCourses,
);

// Get all course purchases - Admin
router.get(
  "/purchases",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllCoursesPurchases,
);

router.get(
  "/operation-course/:courseId",
  isAuthenticated,
  authorizeRoles("admin"),
  getOperationCourse,
);

router.get("/:courseId/progress", isAuthenticated, getCourseProgress);

router.get(
  "/courseProgress/my-courses",
  isAuthenticated,
  getUserCoursesProgress,
);

router.patch(
  "/:courseId/progress/current-lecture",
  isAuthenticated,
  updateCurrentLecture,
);

router.patch("/:courseId/progress/complete", isAuthenticated, completeLecture);
// Get purchases for a specific course - Admin
router.get(
  "/:id/purchases",
  isAuthenticated,
  authorizeRoles("admin"),
  getCoursePurchases,
);

// Get public course by ID
router.get("/public-course/:id", getPublicCourse);

// Get course content for authenticated user
router.get("/content-course/:id", isAuthenticated, getContentCourseByUser);
// Add question
router.put("/add-question", isAuthenticated, addQuestion);

// Add answer
router.put("/add-answer", isAuthenticated, addAnswer);

// Add course review
router.put("/add-review/:id", isAuthenticated, addReviewCourse);

// Add admin reply to review
router.post(
  "/add-reply-review",
  isAuthenticated,
  authorizeRoles("admin"),
  addReplyReview,
);

// Update course - Admin
router.patch(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateCourse,
);

// Generate VdoCipher OTP
router.post("/getVdoCipherOTP", generateVideoUrl);

// Get course by ID - Admin
router.get("/:id", isAuthenticated, authorizeRoles("admin"), getAdminCourse);

export default router;
