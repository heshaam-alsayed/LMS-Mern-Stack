import type {
  ListCategoriesParams,
  ListCategoriesResponse,
} from "@/types/category.type";

import { apiClient } from "./apiClient";

export const getAllCategories = async (
  params: ListCategoriesParams = {},
): Promise<ListCategoriesResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  const res = await apiClient(
    `/categories${query ? `?${query}` : ""}`,
    {
      method: "GET",
    },
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Error in fetch categories");
  }
  return data;
};