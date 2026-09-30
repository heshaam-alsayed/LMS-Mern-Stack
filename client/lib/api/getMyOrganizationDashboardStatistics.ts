import { GetOrganizationDashboardStatisticsResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getMyOrganizationDashboardStatistics =
  async (): Promise<GetOrganizationDashboardStatisticsResponse> => {
    const res = await apiClient("/organizations/dashboard-statistics", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Error fetching dashboard statistics",
      );
    }

    return data;
  };
