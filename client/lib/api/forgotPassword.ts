import { forgotPasswordFormData } from "@/types/auth.type";
import { apiClient } from "./apiClient";

export const forgotPassword = async (body: forgotPasswordFormData) => {
  const response = await apiClient("/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send reset link");
  }

  return data;
};