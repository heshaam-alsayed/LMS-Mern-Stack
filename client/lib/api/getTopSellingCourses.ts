import { apiClient } from "./apiClient";
import { ITopSellingCoursesResponse } from "@/types/course.type";

export const getTopSellingCourses = async (
  limit?: string,
): Promise<ITopSellingCoursesResponse> => {
  const endpoint = limit
    ? `/courses/top-selling?limit=limit`
    : "/courses/top-selling";
  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error Fetching Top Selling Courses");
  }

  return data;
};
