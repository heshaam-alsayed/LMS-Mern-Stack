import type {
  RejectInstructorApplicationData,
  RejectInstructorApplicationResponse,
} from "@/types/instructorApplication.type";

import { apiClient } from "./apiClient";

export const rejectInstructorApplication = async (
  id: string,
  payload: RejectInstructorApplicationData,
): Promise<RejectInstructorApplicationResponse> => {
  const response = await apiClient(
    `/instructor-applications/admin/${id}/reject`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reject instructor application");
  }

  return data;
};
