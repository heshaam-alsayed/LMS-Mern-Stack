import { GetInstructorApplicationResponse } from "@/types/instructorApplication.type";
import { apiClient } from "./apiClient";

export const fetchInstructorApplication = async (
  id: string,
): Promise<GetInstructorApplicationResponse> => {
  const response = await apiClient(
    `/instructor-applications/admin/${id}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch instructor application");
  }

  return data;
};
