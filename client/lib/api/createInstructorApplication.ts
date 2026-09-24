import { CreateInstructorApplicationData, CreateInstructorApplicationResponse } from "@/types/instructorApplication.type";
import { apiClient } from "./apiClient";

export const createInstructorApplication = async (
  body: CreateInstructorApplicationData,
): Promise<CreateInstructorApplicationResponse> => {
  const res = await apiClient("/instructor-applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Error in submitting organization application",
    );
  }

  return data;
};
