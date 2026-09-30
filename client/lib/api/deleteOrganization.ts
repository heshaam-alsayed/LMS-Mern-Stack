import { DeleteOrganizationResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const deleteOrganization = async (
  id: string,
): Promise<DeleteOrganizationResponse> => {
  const res = await apiClient(`/organizations/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error deleting organization");
  }

  return data;
};
