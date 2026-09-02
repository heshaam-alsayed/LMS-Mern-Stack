import { apiClient } from "./apiClient";

export const getUsersMonthlyAnalytics = async (year: string) => {
  const endPoint = year
    ? `/users/monthly-analytics?year=${year}`
    : "/users/monthly-analytics";

  const res = await apiClient(endPoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error Fetching Analytics users");
  }

  return data;
};
