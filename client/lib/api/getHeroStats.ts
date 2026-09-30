import { IHeroStatsResponse } from "@/types/layout.type";
import { apiClient } from "./apiClient";

export const getHeroStatsData = async (): Promise<IHeroStatsResponse> => {
  const res = await apiClient(`/layouts/hero-stats`, {
    method: "GET",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Error in fetch hero stats");
  }
  return data;
};
