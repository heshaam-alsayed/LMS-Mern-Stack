import {ICourseDetailsResponse } from "@/types/operation.type";
import { apiClient } from "./apiClient";

export const getOperationCourse = async (courseId: string):Promise<ICourseDetailsResponse> => {
  const endpoint = `/courses/operation-course/${courseId}`;

  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error getting operation course");
  }

  return data;
};
