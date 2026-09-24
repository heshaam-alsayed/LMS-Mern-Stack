import { apiClient } from "./apiClient";

export const updateCurrentLecture = async (
  courseId: string,
  lectureId: string,
) => {
  const res = await apiClient(
    `/courses/${courseId}/progress/current-lecture`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lectureId,
      }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Error updating current lecture",
    );
  }

  return data;
};