import { GetCertificateResponse } from "@/types/certificate.type";
import { apiClient } from "./apiClient";

export const verifyCertificate = async (
  courseId: string,
): Promise<GetCertificateResponse> => {
  const endpoint = `/certificates/verify/${courseId}`;

  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error in Verify Certificate");
  }

  return data;
};
