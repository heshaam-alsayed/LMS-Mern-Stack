import { resetPasswordRequest } from "@/types/auth.type";
import { apiClient } from "./apiClient";

export const resetPassword = async (body: resetPasswordRequest) => {
  const response = await apiClient("/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reset password");
  }

  return data;
};