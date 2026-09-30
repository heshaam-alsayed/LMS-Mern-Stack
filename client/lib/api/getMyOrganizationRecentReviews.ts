import { GetRecentReviewsResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getMyOrganizationRecentReviews = async (
  top = 5,
): Promise<GetRecentReviewsResponse> => {
  const res = await apiClient(`/organizations/recent-reviews?top=${top}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Error fetching recent reviews",
    );
  }

  return data;
};
