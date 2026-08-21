import { apiClient } from "./apiClient";

export const updateAvatar = async (avatar: string) => {
  const response = await apiClient("/users/update-avatar", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ avatar }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload avatar");
  }
  return data;
};
