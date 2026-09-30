import { GetOrganizationOrdersAnalyticsResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getMyOrganizationOrdersAnalytics = async (
  year: string,
): Promise<GetOrganizationOrdersAnalyticsResponse> => {
  const endpoint = year
    ? `/organizations/orders-analytics?year=${year}`
    : `/organizations/orders-analytics`;

  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Error fetching organization orders analytics",
    );
  }

  return data;
};
