import { LayoutType } from "@/types/layout.type";
import { apiClient } from "./apiClient";

export const createLayout = async (type: LayoutType) => {
  const res = await apiClient("/layouts/create-layout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error in create Layout");
  }

  return data;
};
