import { GetInstructorApplicationResponse } from "@/types/instructorApplication.type";
import { apiClient } from "./apiClient";

export const getInstructorApplication = async (
  email: string,
): Promise<GetInstructorApplicationResponse> => {
  const response = await apiClient(
    `/instructor-applications/status?email=${email}`,
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
