import { GetRecentEnrollmentsResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getMyOrganizationRecentEnrollments = async (
  top = 5,
): Promise<GetRecentEnrollmentsResponse> => {
  const res = await apiClient(
    `/organizations/recent-enrollments?top=${top}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Error fetching recent enrollments",
    );
  }

  return data;
};
