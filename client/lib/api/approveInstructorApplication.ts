import type {
  ApproveInstructorApplicationResponse,
} from "@/types/instructorApplication.type";

import { apiClient } from "./apiClient";

export const approveInstructorApplication = async (
  id: string,
): Promise<ApproveInstructorApplicationResponse> => {
  const response = await apiClient(
    `/instructor-applications/admin/${id}/approve`,
    {
      method: "PATCH",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to approve instructor application",
    );
  }

  return data;
};