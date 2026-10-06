import type {
  ListTicketsParams,
  ListTicketsResponse,
} from "@/types/ticket.type";

import { apiClient } from "./apiClient";

export const getAssignedTickets = async (
  params: ListTicketsParams = {},
): Promise<ListTicketsResponse> => {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page ?? 1));

  searchParams.set("limit", String(params.limit ?? 10));

  if (params.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }

  const res = await apiClient(`/tickets/assigned?${searchParams.toString()}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error in getting assigned tickets");
  }

  return data;
};