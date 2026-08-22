import { CourseData } from "@/types/course.type";
import { apiClient } from "./apiClient";

export const updateCourse = async (courseId: string, body: CourseData) => {
  const res = await apiClient(`/courses/edit-course/${courseId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error in update course");
  }

  return data;
};
