import {
  GetMyOrganizationCoursesPerformanceResponse,
  MyOrganizationCoursesPerformanceParams,
} from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getMyOrganizationCoursesPerformance = async (
  params: MyOrganizationCoursesPerformanceParams = {},
): Promise<GetMyOrganizationCoursesPerformanceResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  const res = await apiClient(
    `/organizations/courses-performance${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error fetching course performance");
  }

  return data;
};
