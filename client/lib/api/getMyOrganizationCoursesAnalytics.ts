import { GetOrganizationCoursesAnalyticsResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getMyOrganizationCoursesAnalytics = async (
  year: string,
): Promise<GetOrganizationCoursesAnalyticsResponse> => {
  const endpoint = year
    ? `/organizations/courses-analytics?year=${year}`
    : `/organizations/courses-analytics`;

  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Error fetching organization courses analytics",
    );
  }

  return data;
};
