import { GetOrganizationsResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getAllOrganizations = async (queryString: string): Promise<GetOrganizationsResponse> => {
  const res = await apiClient(`/organizations?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error in Fetch Organizations");
  }

  return data;
};
