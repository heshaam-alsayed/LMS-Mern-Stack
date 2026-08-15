import express from "express";
import {
  addAnswer,
  addQuestion,
  addReplyReview,
  addReviewCourse,
  createCourse,
  generateVideoUrl,
  getAllCourses,
  getAllCoursesPurchases,
  getContentCourseByUser,
  getCoursePurchases,
  getCourses,
  getMonthlyCoursesAnalytics,
  getPublicCourse,
  getTopSellingCourses,
  updateCourse,
} from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  createCourse,
);

router.patch(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateCourse,
);

router.get("/public-course/:id", getPublicCourse);
router.get("/public-courses", getAllCourses);

router.get("/content-course/:id", isAuthenticated, getContentCourseByUser);
router.put("/add-question", isAuthenticated, addQuestion);
router.put("/add-answer", isAuthenticated, addAnswer);
router.put("/add-review/:id", isAuthenticated, addReviewCourse);
router.post(
  "/add-reply-review",
  isAuthenticated,
  authorizeRoles("admin"),
  addReplyReview,
);

router.get(
  "/monthly-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getMonthlyCoursesAnalytics,
);

router.get(
  "/:id/purchases",
  isAuthenticated,
  authorizeRoles("admin"),
  getCoursePurchases,
);

router.get(
  "/purchases",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllCoursesPurchases,
);

router.get(
  "/top-selling",
  isAuthenticated,
  authorizeRoles("admin"),
  getTopSellingCourses,
);

router.post("/getVdoCipherOTP", generateVideoUrl);

router.get("/", isAuthenticated, authorizeRoles("admin"), getCourses);
export default router;
