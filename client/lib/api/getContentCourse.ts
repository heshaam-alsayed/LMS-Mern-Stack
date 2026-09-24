import { IContentCourseResponse } from "@/types/course.type";
import { apiClient } from "./apiClient";
import { ApiError } from "../ApiError";

export const getContentCourse = async (
  courseId: string,
): Promise<IContentCourseResponse> => {
  const res = await apiClient(`/courses/content-course/${courseId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      data.message || "Error in Fetching Content Course",
      res.status,
    );
  }

  return data;
};
