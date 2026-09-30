import { IContentCourseResponse } from "@/types/course.type";
import { apiClient } from "./apiClient";
import { ApiError } from "../ApiError";

type Body = {
  review: string;
  rating: number;
};
export const addNewReviewCourse = async (body: Body, courseId: string) => {
  const res = await apiClient(`/courses/add-review/${courseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      data.message || "Error add new Review Course",
      res.status,
    );
  }

  return data;
};
