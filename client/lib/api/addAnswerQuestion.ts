import { IContentCourseResponse } from "@/types/course.type";
import { apiClient } from "./apiClient";
import { ApiError } from "../ApiError";

type Body = {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
};
export const addAnswerQuestion = async (
  body: Body,
): Promise<IContentCourseResponse> => {
  const res = await apiClient(`/courses/add-answer`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      data.message || "Error add new answer for question lecture",
      res.status,
    );
  }

  return data;
};
