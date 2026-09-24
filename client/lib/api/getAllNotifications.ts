import { INotificationsResponse } from "@/types/notification.type";
import { apiClient } from "./apiClient";

export const getAllNotifications = async (
  queryString: string = "",
): Promise<INotificationsResponse> => {
  const endpoint = queryString
    ? `/notifications?${queryString}`
    : "/notifications";

  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting notifications");
  }

  return data;
};
