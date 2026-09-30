import { GetOrganizationOrdersResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getOrganizationOrders = async (
  queryString: string = "",
): Promise<GetOrganizationOrdersResponse> => {
  const params = new URLSearchParams(queryString);

  const query = params.toString();

  const endpoint = query
    ? `/organizations/orders?${query}`
    : `/organizations/orders`;

  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting organization orders");
  }

  return data;
};
