import { GetOrganizationCoursesAnalyticsResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getOrganizationCoursesAnalytics = async (
  id: string,
  year: string,
): Promise<GetOrganizationCoursesAnalyticsResponse> => {
  const endpoint = year
    ? `/organizations/${id}/courses-analytics?year=${year}`
    : `/organizations/${id}/courses-analytics`;

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
