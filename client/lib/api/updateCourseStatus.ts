import { CourseStatusType } from "@/types/course.type";
import { apiClient } from "./apiClient";

export const updateCourseStatus = async (
  courseId: string,
  status: CourseStatusType,
) => {
  const res = await apiClient(`/courses/edit-course/${courseId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error updating course status");
  }

  return data;
};
