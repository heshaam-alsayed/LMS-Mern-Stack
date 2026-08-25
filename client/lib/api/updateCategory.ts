import { IRequestBodyCategory } from "@/types/category.type";
import { apiClient } from "./apiClient";

export const updateCategory = async (
  categoryId: string,
  body: IRequestBodyCategory,
) => {
  const res = await apiClient(`/categories/${categoryId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Error in update Category");
  }
  return data;
};
