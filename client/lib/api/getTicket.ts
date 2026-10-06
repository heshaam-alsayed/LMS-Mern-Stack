import type { GetTicketResponse } from "@/types/ticket.type";

import { apiClient } from "./apiClient";

export const getTicket = async (
  ticketId: string,
): Promise<GetTicketResponse> => {
  const res = await apiClient(`/tickets/${ticketId}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error in getting ticket");
  }

  return data;
};