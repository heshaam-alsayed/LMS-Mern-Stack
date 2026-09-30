import { GetOrganizationCertificatesResponse } from "@/types/certificate.type";
import { apiClient } from "./apiClient";

export const getOrganizationCertificates = async (
  queryString: string = "",
): Promise<GetOrganizationCertificatesResponse> => {
  const params = new URLSearchParams(queryString);

  const query = params.toString();

  const endpoint = query
    ? `/organizations/certificates?${query}`
    : `/organizations/certificates`;

  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting organization certificates");
  }

  return data;
};
