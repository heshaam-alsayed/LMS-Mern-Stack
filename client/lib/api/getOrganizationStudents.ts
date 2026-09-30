import { GetOrganizationStudentsResponse } from "@/types/organization.type";
import { apiClient } from "./apiClient";

export const getOrganizationStudents = async (
  queryString: string = "",
): Promise<GetOrganizationStudentsResponse> => {
  const params = new URLSearchParams(queryString);

  const query = params.toString();

  const endpoint = query
    ? `/organizations/students?${query}`
    : `/organizations/students`;

  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting organization students");
  }

  return data;
};
