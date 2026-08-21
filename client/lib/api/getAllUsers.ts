import { apiClient } from "./apiClient";

export const getAllUsers = async (
  queryString: string = "",
  isTeam: boolean = false,
) => {
  const params = new URLSearchParams(queryString);

  // Teams page -> always get admins
  if (isTeam) {
    params.set("role", "admin");
  }

  const query = params.toString();

  const endpoint = query ? `/users?${query}` : "/users";

  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting Users");
  }

  return data;
};
