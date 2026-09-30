import {
  UpdateOrganizationPayload,
  UpdateOrganizationResponse,
} from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const updateOrganization = async (
  id: string,
  payload: UpdateOrganizationPayload,
): Promise<UpdateOrganizationResponse> => {
  const res = await apiClient(`/organizations/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error updating organization");
  }

  return data;
};
