import { UpdateRoleBody } from "@/types/user.type";
import { apiClient } from "./apiClient";

export const changeRole = async (body: UpdateRoleBody) => {
  const res = await apiClient("/users/change-role", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error in change Role");
  }

  return data;
};
