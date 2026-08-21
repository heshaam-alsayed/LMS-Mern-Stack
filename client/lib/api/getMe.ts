import { IUser } from "@/types/auth.type";
import { apiClient } from "./apiClient";

type GetMeResponse = {
  success: boolean;
  user: IUser;
};

export const getMe = async (): Promise<GetMeResponse> => {
  const res = await apiClient("/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = (await res.json()) as GetMeResponse;

  if (!res.ok) {
    throw new Error((result as { message?: string }).message || "Failed to Load User Data");
  }
  return result;
};
