import { GetMyOrganizationResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getMyOrganization =
  async (): Promise<GetMyOrganizationResponse> => {
    const res = await apiClient("/organizations/my-organization", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Error getting your organization",
      );
    }

    return data;
  };
