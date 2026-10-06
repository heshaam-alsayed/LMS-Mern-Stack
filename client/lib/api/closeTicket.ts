import type { AcceptTicketResponse } from "@/types/ticket.type";

import { apiClient } from "./apiClient";

export const closeTicket = async (
  ticketId: string,
): Promise<AcceptTicketResponse> => {
  const res = await apiClient(`/tickets/${ticketId}/close`, {
    method: "PATCH",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error in closing ticket");
  }

  return data;
};