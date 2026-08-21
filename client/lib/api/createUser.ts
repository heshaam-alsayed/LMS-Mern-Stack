import { CreateNewMember } from "@/types/user.type";
import { apiClient } from "./apiClient";

export const createUser = async (body: CreateNewMember) => {
  const res = await apiClient("/users/create-member", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error in create new member");
  }

  return data;
};
