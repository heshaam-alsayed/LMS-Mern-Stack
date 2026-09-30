import { GetMyOrganizationCourseResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getMyOrganizationCourse = async (
  courseId: string,
): Promise<GetMyOrganizationCourseResponse> => {
  const res = await apiClient(
    `/organizations/course/${encodeURIComponent(courseId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting course");
  }

  return data;
};
