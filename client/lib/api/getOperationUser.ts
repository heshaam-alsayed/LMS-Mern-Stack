import { IAdminUserResponse } from "@/types/operation.type";
import { apiClient } from "./apiClient";

export const getOperationUser = async (userId: string):Promise<IAdminUserResponse> => {
  const endpoint = `/users/operation-user/${userId}`;

  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting operation user");
  }

  return data;
};
