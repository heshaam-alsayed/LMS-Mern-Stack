"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminTicket } from "@/lib/api/getAdminTicket";
import { getAdminTicketMessages } from "@/lib/api/getAdminTicketMessages";

export const useAdminTicketDetails = (ticketId: string, enabled = true) => {
  const ticketQuery = useQuery({
    queryKey: ["admin-ticket", ticketId],
    queryFn: () => getAdminTicket(ticketId),
    enabled: enabled && !!ticketId,
    retry: false,
  });

  const messagesQuery = useQuery({
    queryKey: ["admin-ticket-messages", ticketId],
    queryFn: () => getAdminTicketMessages(ticketId),
    enabled: enabled && !!ticketId,
    retry: false,
  });

  return {
    ticket: ticketQuery.data?.ticket,
    messages: messagesQuery.data?.messages ?? [],
    isLoading: ticketQuery.isLoading || messagesQuery.isLoading,
    isError: ticketQuery.isError || messagesQuery.isError,
    error: ticketQuery.error ?? messagesQuery.error,
    isFetching: ticketQuery.isFetching || messagesQuery.isFetching,
    refetch: () => {
      ticketQuery.refetch();
      messagesQuery.refetch();
    },
  };
};