import { IRevenueOrdersResponse } from "@/types/order.type";
import { apiClient } from "./apiClient";

export const getOrdersRevenueMonthly = async (
  year: string,
): Promise<IRevenueOrdersResponse> => {
  const endPoint = year
    ? `/orders/revenue-analytics?year=${year}`
    : "/orders/revenue-analytics";

  const res = await apiClient(endPoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(res);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error Fetching Revenue orders");
  }

  return data;
};
