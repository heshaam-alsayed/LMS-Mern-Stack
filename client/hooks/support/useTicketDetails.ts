"use client";

import { useQuery } from "@tanstack/react-query";

import { getTicket } from "@/lib/api/getTicket";
import { getTicketMessages } from "@/lib/api/getTicketMessages";

export const useTicketDetails = (ticketId: string) => {
  const ticketQuery = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicket(ticketId),
    enabled: !!ticketId,
  });

  const messagesQuery = useQuery({
    queryKey: ["ticket-messages", ticketId],
    queryFn: () => getTicketMessages(ticketId),
    enabled: !!ticketId,
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