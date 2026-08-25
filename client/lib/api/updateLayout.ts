import { IUpdateLayoutData } from "@/types/layout.type";
import { apiClient } from "./apiClient";

export const updateLayout = async (body: IUpdateLayoutData) => {
  const res = await apiClient(`/layouts/update-layout`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Error in Update layout");
  }

  return data;
};
