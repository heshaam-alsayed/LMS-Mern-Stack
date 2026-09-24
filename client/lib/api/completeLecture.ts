import { apiClient } from "./apiClient";

export const completeLecture = async (courseId: string, lectureId: string) => {
  const res = await apiClient(`/courses/${courseId}/progress/complete`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lectureId,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error completing lecture");
  }

  return data;
};
