import { apiClient } from "./apiClient";

export const toggleDeletedUser = async (id: string) => {
  const res = await apiClient(`/users/toggle-user-deleted/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to toggle user deleted status");
  }

  return data;
};
