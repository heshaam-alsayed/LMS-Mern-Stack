"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useTicketDetails } from "@/hooks/support/useTicketDetails";
import { socket } from "@/lib/socket";

import TicketChatHeader from "./TicketChatHeader";
import TicketChatPanel from "./TicketChatPanel";
import TicketDetailsError from "./TicketDetailsError";
import TicketDetailsSkeleton from "./TicketDetailsSkeleton";
import TicketMessages from "./TicketMessages";

import type { ITicket, TicketStatus } from "@/types/ticket.type";

type Props = {
  ticketId: string;
};

export default function TicketDetailsContent({ ticketId }: Props) {
  const queryClient = useQueryClient();

  const { ticket: initialTicket, messages, isLoading, isError, error, refetch } =
    useTicketDetails(ticketId);

  const [ticket, setTicket] = useState<ITicket | undefined>(initialTicket);

  useEffect(() => {
    if (initialTicket) {
      setTicket(initialTicket);
    }
  }, [initialTicket]);

  useEffect(() => {
    const handleAccepted = (payload: {
        ticketId:string,
        status: TicketStatus
        assignedTo: string,
      },) => {
      if (!payload || payload.ticketId !== ticketId) return;

      setTicket((prev) => {
        if (!prev) return prev;

        return { ...prev, status: payload.status, assignedTo: payload.assignedTo };
      });
    };

    const handleClosed = (payload: {
      ticketId: string;
      status: TicketStatus;
    }) => {
      if (!payload || payload.ticketId !== ticketId) return;

      setTicket((prev) => {
        if (!prev) return prev;

        return { ...prev, status: "closed" as TicketStatus };
      });
    };

    socket.on("ticket:accepted", handleAccepted);

    socket.on("ticket:closed", handleClosed);

    return () => {
      socket.off("ticket:accepted", handleAccepted);

      socket.off("ticket:closed", handleClosed);
    };
  }, [ticketId]);

  if (isLoading || !ticket) return <TicketDetailsSkeleton />;

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <TicketDetailsError
            message={
              error instanceof Error
                ? error.message
                : "Something went wrong while loading this ticket."
            }
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  const hasAssignedAdmin = Boolean(ticket.assignedTo);

  const currentUserId =
    typeof ticket.user === "string" ? undefined : ticket.user._id;

  return (
    <div className="flex h-full flex-col">
      <TicketChatHeader ticket={ticket} />

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <TicketMessages messages={messages} currentUserId={currentUserId} />
        </div>
      </div>

      <div className="shrink-0 border-t bg-background px-4 py-3">
        <div className="mx-auto w-full max-w-3xl">
          <TicketChatPanel
            ticketId={ticketId}
            status={ticket.status}
            hasAssignedAdmin={hasAssignedAdmin}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </div>
  );
}