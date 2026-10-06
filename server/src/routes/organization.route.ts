import {
  deleteOrganization,
  getAllOrganizations,
  getMyOrganization,
  getMyOrganizationCoursesAnalytics,
  getMyOrganizationDashboardStatistics,
  getMyOrganizationOrdersAnalytics,
  getOrganizationCourses,
  getOrganizationCoursesAnalytics,
  getOrganizationDetails,
  getOrganizationInstructor,
  getOrganizationOrders,
  getOrganizationOrdersAnalytics,
  getOrganizationStudents,
  getOrganizationCertificates,
  getOrganizationStudentProgress,
  getOrganizationCourseDetail,
  updateOrganization,
  getMyOrganizationCoursesPerformance,
  getMyOrganizationCourseOrdersAnalytics,
  getMyOrganizationRecentEnrollments,
  getMyOrganizationRecentReviews,
  getMyOrganizationCourse,
} from "../controllers/organization.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware";

const express = require("express");
const router = express.Router();

router.get("/", isAuthenticated, authorizeRoles("admin"), getAllOrganizations);

router.get(
  "/my-organization",
  isAuthenticated,
  authorizeRoles("instructor"),
  getMyOrganization,
);

router.get(
  "/dashboard-statistics",
  isAuthenticated,
  authorizeRoles("instructor"),
  getMyOrganizationDashboardStatistics,
);

router.get(
  "/courses-performance",
  isAuthenticated,
  authorizeRoles("instructor"),
  getMyOrganizationCoursesPerformance,
);

router.get(
  "/course-orders-analytics",
  isAuthenticated,
  authorizeRoles("instructor", "admin"),
  getMyOrganizationCourseOrdersAnalytics,
);

router.get(
  "/recent-enrollments",
  isAuthenticated,
  authorizeRoles("instructor"),
  getMyOrganizationRecentEnrollments,
);

router.get(
  "/recent-reviews",
  isAuthenticated,
  authorizeRoles("instructor"),
  getMyOrganizationRecentReviews,
);

router.get(
  "/course/:courseId",
  isAuthenticated,
  authorizeRoles("instructor"),
  getMyOrganizationCourse,
);

router.get(
  "/:id/courses",
  isAuthenticated,
  authorizeRoles("instructor"),
  getOrganizationCourses,
);

router.get(
  "/orders",
  isAuthenticated,
  authorizeRoles("instructor"),
  getOrganizationOrders,
);

router.get(
  "/students",
  isAuthenticated,
  authorizeRoles("instructor"),
  getOrganizationStudents,
);

router.get(
  "/student-progress/:studentId",
  isAuthenticated,
  authorizeRoles("instructor"),
  getOrganizationStudentProgress,
);

router.get(
  "/course-detail/:courseId",
  isAuthenticated,
  authorizeRoles("instructor"),
  getOrganizationCourseDetail,
);

router.get(
  "/certificates",
  isAuthenticated,
  authorizeRoles("instructor"),
  getOrganizationCertificates,
);

router.get(
  "/courses-analytics",
  isAuthenticated,
  authorizeRoles("instructor"),
  getMyOrganizationCoursesAnalytics,
);

router.get(
  "/orders-analytics",
  isAuthenticated,
  authorizeRoles("instructor"),
  getMyOrganizationOrdersAnalytics,
);

router.get(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  getOrganizationDetails,
);

router.get(
  "/:id/courses-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getOrganizationCoursesAnalytics,
);

router.get(
  "/:id/orders-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getOrganizationOrdersAnalytics,
);

router.get(
  "/:id/instructor",
  isAuthenticated,
  authorizeRoles("admin"),
  getOrganizationInstructor,
);

router.patch(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateOrganization,
);

router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteOrganization,
);

export default router;