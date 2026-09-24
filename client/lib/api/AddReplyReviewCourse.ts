import { apiClient } from "./apiClient";
import { ApiError } from "../ApiError";

type Body = {
  comment: string;
  courseId: string;
  reviewId: string;
};
export const addReplyReviewCourse = async (body: Body) => {
  const res = await apiClient(`/courses/add-reply-review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      data.message || "Error add Reply Review Course",
      res.status,
    );
  }

  return data;
};
