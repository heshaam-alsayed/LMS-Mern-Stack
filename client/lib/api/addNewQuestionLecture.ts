import { IContentCourseResponse } from "@/types/course.type";
import { apiClient } from "./apiClient";
import { ApiError } from "../ApiError";

type Body = {
  question: string;
  courseId: string;
  contentId: string;
};
export const addNewQuestionLecture = async (
  body: Body,
): Promise<IContentCourseResponse> => {
  const res = await apiClient(`/courses/add-question`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      data.message || "Error add new question lecture",
      res.status,
    );
  }

  return data;
};
