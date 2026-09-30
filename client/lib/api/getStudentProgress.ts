import { GetStudentProgressResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getStudentProgress = async (
  studentId: string,
): Promise<GetStudentProgressResponse> => {
  const res = await apiClient(
    `/organizations/student-progress/${studentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting student progress");
  }

  return data;
};
