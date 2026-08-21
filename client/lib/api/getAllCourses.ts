import { apiClient } from "./apiClient";

export const getAllCourses = async (queryString: string = "") => {
  const endpoint = queryString ? `/courses?${queryString}` : "/courses";

  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting courses");
  }

  return data;
};
