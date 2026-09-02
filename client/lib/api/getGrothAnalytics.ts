import { IGrowthResponse } from "@/types/order.type";
import { apiClient } from "./apiClient";

export const getGrothAnalytics = async (): Promise<IGrowthResponse> => {
  const res = await apiClient("/orders/monthly-growth", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  console.log(res)
  if (!res.ok) {
    throw new Error(data.message || "Error Fetching Analytics Groth");
  }

  return data;
};
