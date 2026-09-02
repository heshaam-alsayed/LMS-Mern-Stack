import { apiClient } from "./apiClient";

export const getOrdersMonthlyAnalytics = async (year: string) => {
  const endPoint = year
    ? `/orders/monthly-analytics?year=${year}`
    : "/orders/monthly-analytics";

  const res = await apiClient(endPoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error Fetching Analytics Orders");
  }

  return data;
};
