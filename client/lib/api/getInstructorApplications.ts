import { GetInstructorApplicationsResponse } from "@/types/instructorApplication.type";

import { apiClient } from "./apiClient";

export const getInstructorApplications = async (
  queryString: string,
): Promise<GetInstructorApplicationsResponse> => {
  const response = await apiClient(`/instructor-applications/admin?${queryString}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch instructor applications");
  }

  return data;
};
