import { ICoursesStatisticsResponse } from "@/types/course.type";
import { apiClient } from "./apiClient";

export const getCoursesStatistics = async (
  year: string,
): Promise<ICoursesStatisticsResponse> => {
  const endPoint = year
    ? `/courses/analytics/statistics?year=${year}`
    : "/courses/analytics/statistics";

  const res = await apiClient(endPoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error Fetching Statistics Courses");
  }

  return data;
};
