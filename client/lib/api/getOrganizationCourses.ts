import { GetOrganizationCoursesResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getOrganizationCourses = async (
  id: string,
  queryString: string = "",
): Promise<GetOrganizationCoursesResponse> => {
  const params = new URLSearchParams(queryString);

  const query = params.toString();

  const endpoint = query
    ? `/organizations/${id}/courses?${query}`
    : `/organizations/${id}/courses`;

  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting organization courses");
  }

  return data;
};
