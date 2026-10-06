import type { GetTicketMessagesResponse } from "@/types/ticket.type";

import { apiClient } from "./apiClient";

export const getTicketMessages = async (
  ticketId: string,
): Promise<GetTicketMessagesResponse> => {
  const res = await apiClient(`/tickets/${ticketId}/messages`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error in getting ticket messages");
  }

  return data;
};