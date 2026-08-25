import { LayoutType } from "@/types/layout.type";
import { apiClient } from "./apiClient";

export const getLayout = async (type: LayoutType) => {
  const res = await apiClient(`/layouts/${type}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Error in fetch layout");
  }

  return data;
};
