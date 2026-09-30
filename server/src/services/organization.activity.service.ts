import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";

import AppError from "../utils/AppError";

import { getMyOrganizationService } from "./organization.service";

// the instructor picks how many rows they want, so it is clamped instead of
// trusted
const parseTop = (top: unknown) => {
  return Math.min(Math.max(Number(top) || 5, 1), 50);
};

export const getMyOrganizationRecentEnrollmentsService = async (
  instructorId: string,
  top = 5,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  const organization = await getMyOrganizationService(instructorId);

  const limit = parseTop(top);

  const enrollments = await OrderModel.find({
    organization: organization._id,
  })
    .select("user course price createdAt")
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("user", "name avatar")
    .populate("course", "name")
    .lean();

  return {
    organization,
    result: enrollments.length,
    enrollments,
  };
};

export const getMyOrganizationRecentReviewsService = async (
  instructorId: string,
  top = 5,
) => {
  if (!instructorId) {
    throw new AppError("Instructor ID is required", 400);
  }

  const organization = await getMyOrganizationService(instructorId);

  const limit = parseTop(top);

  // reviews are stored inside the course document, so they need an unwind before
  // they can be sorted by their own date
  const reviews = await CourseModel.aggregate([
    { $match: { organization: organization._id } },

    { $unwind: "$reviews" },

    { $sort: { "reviews.createdAt": -1 } },

    { $limit: limit },

    {
      $project: {
        _id: "$reviews._id",
        rating: "$reviews.rating",
        comment: "$reviews.comment",
        createdAt: "$reviews.createdAt",
        course: { _id: "$_id", name: "$name" },
        // the review keeps a snapshot of the user, so only the safe fields are
        // handed back. the email is not sent to the instructor
        user: {
          _id: "$reviews.user._id",
          name: "$reviews.user.name",
          avatar: "$reviews.user.avatar",
        },
      },
    },
  ]);

  return {
    organization,
    result: reviews.length,
    reviews,
  };
};
