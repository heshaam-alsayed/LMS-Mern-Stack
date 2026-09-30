import { GenerateCertificateResponse } from "@/types/certificate.type";
import { apiClient } from "./apiClient";

export const generateCertificate = async (courseId: string):Promise<GenerateCertificateResponse> => {
  const endpoint = `/certificates/generate/${courseId}`;

  const res = await apiClient(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error in Generate certificate");
  }

  return data;
};
