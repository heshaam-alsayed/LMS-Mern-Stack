import { IPublicCoursesResponse } from "@/types/course.type";
import { apiClient } from "./apiClient";

export const getPublicCoursesUser =
  async (): Promise<IPublicCoursesResponse> => {
    const res = await apiClient(`/courses/public-courses`, {
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
