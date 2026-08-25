import { apiClient } from "./apiClient";

export const getAllLayouts = async () => {
  console.log("calling all layouts")
  const res = await apiClient("/layouts", {
    method: "GET",
  });

  console.log("STATUS:", res.status);
  console.log("URL:", res.url);

  const data = await res.json();

  console.log("DATA:", data);

  if (!res.ok) {
    throw new Error(data?.message || "Error in fetch layouts");
  }

  return data;
};
