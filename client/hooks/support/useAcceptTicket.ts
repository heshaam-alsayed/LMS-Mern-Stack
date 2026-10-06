"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { acceptTicket } from "@/lib/api/acceptTicket";

export const useAcceptTicket = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => acceptTicket(ticketId),

    onSuccess: (data) => {
      queryClient.setQueryData(["ticket", ticketId], {
        success: true,
        ticket: data.ticket,
      });

      queryClient.setQueryData(["admin-ticket", ticketId], {
        success: true,
        ticket: data.ticket,
      });

      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });

      toast.success(data.message || "Ticket accepted successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Error in accepting ticket");

      queryClient.invalidateQueries({ queryKey: ["admin-ticket", ticketId] });

      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
    },
  });
};