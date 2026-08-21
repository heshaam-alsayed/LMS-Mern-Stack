import { CourseData } from "@/types/course.type";
import { apiClient } from "./apiClient";

export const createCourse = async (body: CourseData) => {
  const res = await apiClient("/courses/create-course", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error in create course");
  }

  return data;
};
