import { apiClient } from "./apiClient";

export type LandingReviewUser = {
  _id: string | null;
  name?: string;
  avatar?: { url?: string } | null;
};

export type LandingReview = {
  _id: string;
  rating: number;
  comment: string;
  createdAt?: string;
  course: {
    _id: string;
    name?: string;
  };
  user: LandingReviewUser;
};

export type LatestReviewsResponse = {
  success: boolean;
  data: {
    result: number;
    reviews: LandingReview[];
  };
};

export const getLatestReviews = async (
  top = 6,
): Promise<LatestReviewsResponse> => {
  const res = await apiClient(`/courses/latest-reviews?top=${top}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting reviews");
  }

  return data as LatestReviewsResponse;
};
