import { IEnrolledCoursesResponse } from "@/types/courseProgress.type";
import { apiClient } from "./apiClient";

export const getEnrolledCourses = async (): Promise<IEnrolledCoursesResponse> => {

  const res = await apiClient(`/courses/courseProgress/my-courses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting Enrolled Courses");
  }

  return data;
};
