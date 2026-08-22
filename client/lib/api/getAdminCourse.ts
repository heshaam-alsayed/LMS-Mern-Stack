import { apiClient } from "./apiClient";

export const getAdminCourse = async (courseId: string) => {
  const res = await apiClient(`/courses/${courseId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error in Fetch Course");
  }

  return data;
};
