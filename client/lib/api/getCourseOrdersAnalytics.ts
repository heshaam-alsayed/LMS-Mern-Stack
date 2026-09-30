import { GetCourseOrdersAnalyticsResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getCourseOrdersAnalytics = async (
  courseId: string,
): Promise<GetCourseOrdersAnalyticsResponse> => {
  const res = await apiClient(
    `/organizations/course-orders-analytics?courseId=${encodeURIComponent(courseId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Error fetching course analytics",
    );
  }

  return data;
};
