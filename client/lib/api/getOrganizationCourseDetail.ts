import { GetOrganizationCourseDetailResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getOrganizationCourseDetail = async (
  courseId: string,
): Promise<GetOrganizationCourseDetailResponse> => {
  const res = await apiClient(
    `/organizations/course-detail/${courseId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting course details");
  }

  return data;
};
