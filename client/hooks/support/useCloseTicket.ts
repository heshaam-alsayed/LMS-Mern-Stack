"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { closeTicket } from "@/lib/api/closeTicket";

export const useCloseTicket = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => closeTicket(ticketId),

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

      toast.success(data.message || "Ticket closed successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Error in closing ticket");

      queryClient.invalidateQueries({ queryKey: ["admin-ticket", ticketId] });

      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
    },
  });
};