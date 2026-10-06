import CourseModel from "../models/course.model";

const parseTop = (top: unknown) => Math.min(Math.max(Number(top) || 6, 1), 24);

export const getLatestReviewsService = async (top?: unknown) => {
  const limit = parseTop(top);

  const reviews = await CourseModel.aggregate([
    { $match: { status: "published" } },
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
        user: {
          _id: "$reviews.user._id",
          name: "$reviews.user.name",
          avatar: "$reviews.user.avatar",
        },
      },
    },
  ]);

  return {
    result: reviews.length,
    reviews: reviews.map((review) => ({
      ...review,
      _id: String(review._id),
      course: {
        _id: String(review.course?._id),
        name: review.course?.name,
      },
      user: {
        _id: review.user?._id ? String(review.user._id) : null,
        name: review.user?.name,
        avatar: review.user?.avatar ?? null,
      },
    })),
  };
};
