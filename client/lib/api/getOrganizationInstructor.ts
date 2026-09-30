import { GetOrganizationInstructorResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getOrganizationInstructor = async (
  id: string,
): Promise<GetOrganizationInstructorResponse> => {
  const res = await apiClient(`/organizations/${id}/instructor`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error fetching organization instructor");
  }

  return data;
};
