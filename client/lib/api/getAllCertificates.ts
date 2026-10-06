import { GetCertificatesAdminResponse } from "@/types/certificate.type";
import { apiClient } from "./apiClient";

export const getAllCertificates = async (
  queryString: string = "",
): Promise<GetCertificatesAdminResponse> => {
  const params = new URLSearchParams(queryString);

  const query = params.toString();

  const endpoint = query ? `/certificates/all?${query}` : `/certificates/all`;

  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting certificates");
  }

  return data;
};