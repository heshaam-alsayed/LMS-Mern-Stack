import { apiClient } from "./apiClient";

export const getAllCategories = async () => {
  const res = await apiClient("/categories", {
    method: "GET",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Error in fetch categories");
  }
  return data;
};
