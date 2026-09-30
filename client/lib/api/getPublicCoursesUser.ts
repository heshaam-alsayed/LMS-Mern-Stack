import { IPublicCoursesResponse } from "@/types/course.type";
import { apiClient } from "./apiClient";

export const getPublicCoursesUser = async (
  queryString?: string,
): Promise<IPublicCoursesResponse> => {
  console.log(queryString)
  const endpoint = queryString
    ? `/courses/public-courses?${queryString}`
    : "/courses/public-courses";
  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting courses");
  }

  return data;
};
