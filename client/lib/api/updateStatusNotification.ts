// update/6a137975b49beb2299b90c94

import { apiClient } from "./apiClient";

export const updateStatusNotification = async (id: string) => {
  const res = await apiClient(`/notifications/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "read" }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error update notification status");
  }

  return data;
};
