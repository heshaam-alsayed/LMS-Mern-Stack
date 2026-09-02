import { apiClient } from "./apiClient";
import { IUsersStatisticsResponse } from "@/types/user.type";

export const getUsersStatistics = async (
  year: string,
): Promise<IUsersStatisticsResponse> => {
  const endPoint = year
    ? `/users/analytics/statistics?year=${year}`
    : "/users/analytics/statistics";

  const res = await apiClient(endPoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error Fetching Statistics Users");
  }

  return data;
};
