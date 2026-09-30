import { GetOrganizationDetailsResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getOrganizationDetails = async (
  id: string,
  queryString: string = "",
): Promise<GetOrganizationDetailsResponse> => {
  const params = new URLSearchParams(queryString);

  const query = params.toString();

  const endpoint = query
    ? `/organizations/${id}?${query}`
    : `/organizations/${id}`;

  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting organization details");
  }

  return data;
};
