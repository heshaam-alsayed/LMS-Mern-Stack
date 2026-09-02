import { apiClient } from "./apiClient";

export const getCoursesMonthlyAnalytics = async (year: string) => {
  const endPoint = year
    ? `/courses/monthly-analytics?year=${year}`
    : "/courses/monthly-analytics";

  const res = await apiClient(endPoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error Fetching Analytics Courses");
  }

  return data;
};


