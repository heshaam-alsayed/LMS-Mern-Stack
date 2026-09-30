import { IPublicCourseDetailsResponse } from "@/types/course.type";
import { apiClient } from "./apiClient";

export const getCourseDetails = async (
  courseId: string,
): Promise<IPublicCourseDetailsResponse> => {
  const res = await apiClient(`/courses/public-course/${courseId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error in Fetch Course Details");
  }

  return data;
};
