import { IOrdersStatisticsResponse } from "@/types/order.type";
import { apiClient } from "./apiClient";

export const getOrdersStatistics = async (
  year: string,
): Promise<IOrdersStatisticsResponse> => {
  const endPoint = year
    ? `/orders/analytics/statistics?year=${year}`
    : "/orders/analytics/statistics";

  const res = await apiClient(endPoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error Fetching Statistics Orders");
  }

  return data;
};
