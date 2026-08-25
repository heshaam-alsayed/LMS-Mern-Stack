import { IRequestBodyCategory } from "@/types/category.type";
import { apiClient } from "./apiClient";

export const createCategory = async (body: IRequestBodyCategory) => {
  const res = await apiClient("/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Error in create Category");
  }
  return data;
};
