"use client";

import { useQuery } from "@tanstack/react-query";

import { getAssignedTickets } from "@/lib/api/getAssignedTickets";

import type { ListTicketsParams } from "@/types/ticket.type";

export const useAssignedTickets = (params: ListTicketsParams = {}) => {
  const { page = 1, limit = 10, status = "all" } = params;

  return useQuery({
    queryKey: ["assigned-tickets", page, limit, status],
    queryFn: () => getAssignedTickets({ page, limit, status }),
  });
};