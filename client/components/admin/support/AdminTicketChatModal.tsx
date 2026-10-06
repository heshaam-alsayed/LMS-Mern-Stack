"use client";

import { useEffect } from "react";
import { Check, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TicketMessages from "@/components/support/ticketDetails/TicketMessages";
import { useAcceptTicket } from "@/hooks/support/useAcceptTicket";
import { useCloseTicket } from "@/hooks/support/useCloseTicket";
import { isAssignedToAdmin } from "@/lib/ticketAccess";
import { socket } from "@/lib/socket";

import AdminTicketChatFooter from "./AdminTicketChatFooter";
import AdminTicketChatHeader from "./AdminTicketChatHeader";

import type { ITicket, ITicketMessage } from "@/types/ticket.type";
import Loader from "@/components/shared/Loader";

type Props = {
  ticket: ITicket | undefined;
  messages: ITicketMessage[];
  currentAdminId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AdminTicketChatModal({
  ticket,
  messages,
  currentAdminId,
  open,
  onOpenChange,
}: Props) {
  const queryClient = useQueryClient();

  const ticketId = ticket?._id ?? "";

  const { mutate, isPending } = useAcceptTicket(ticketId);

  const { mutate: closeMutate, isPending: isClosing } =
    useCloseTicket(ticketId);

  useEffect(() => {
    const handleMessage = (incoming: ITicketMessage) => {
      if (!incoming || String(incoming.ticket) !== ticketId) return;

      queryClient.setQueryData(["admin-ticket-messages", ticketId], (old: any) => {
        if (old && !Array.isArray(old.messages)) return old;

        const messages = old?.messages ? [...old.messages] : [];

        if (incoming.clientId) {
          const tempIndex = messages.findIndex(
            (message: ITicketMessage) =>
              message._id === `temp-${incoming.clientId}`,
          );

          if (tempIndex !== -1) {
            messages[tempIndex] = incoming;

            return {
              success: true,
              messages,
            };
          }
        }

        const exists = messages.some(
          (message: ITicketMessage) => message._id === incoming._id,
        );

        if (exists) return old;

        messages.push(incoming);

        return {
          success: true,
          messages,
        };
      });
    };

    socket.on("ticket:message", handleMessage);

    return () => {
      socket.off("ticket:message", handleMessage);
    };
  }, [ticketId, queryClient]);

  useEffect(() => {
    if (!ticket || !open) return;

    const isJoinable =
      ticket.status !== "open" && isAssignedToAdmin(ticket, currentAdminId);

    if (isJoinable) {
      socket.emit("ticket:join", ticketId);
    }

    return () => {
      if (isJoinable) {
        socket.emit("ticket:leave", ticketId);
      }
    };
  }, [ticket, ticketId, open, currentAdminId]);

  if (!ticket) return null;

  const owner =
    ticket.user && typeof ticket.user !== "string" ? ticket.user : null;

  const isOpen = ticket.status === "open";

  const isAssignedToMe = isAssignedToAdmin(ticket, currentAdminId);

  const isInProgress = ticket.status === "in_progress";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95vh] h-full max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 gap-0 border-b px-3 py-2 pr-10">
          <DialogTitle className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate">{ticket.subject}</span>

            <div className="flex shrink-0 items-center gap-2">
              {isOpen ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 shrink-0 gap-1.5 px-2 text-xs"
                  disabled={isPending}
                  onClick={() => mutate()}>
                  {isPending ? (
                    <p className="flex items-center gap-1.5">
                      <Loader size={13} />

                      Accepting...
                    </p>
                  ) : (
                    <>
                      <Check className="size-3" />

                      Accept Ticket
                    </>
                  )}
                </Button>
              ) : null}

              {isInProgress && isAssignedToMe ? (
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 shrink-0 gap-1.5 px-2.5 text-xs"
                  disabled={isClosing}
                  onClick={() => closeMutate()}>
                  {isClosing ? (
                    <p className="flex items-center gap-1.5">
                      <Loader size={13} />

                      Closing...
                    </p>
                  ) : (
                    <>
                      <XCircle className="size-3" />

                      Close Ticket
                    </>
                  )}
                </Button>
              ) : null}
            </div>
          </DialogTitle>
        </DialogHeader>

        <AdminTicketChatHeader
          ticket={ticket}
          currentAdminId={currentAdminId}
        />

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
          <TicketMessages messages={messages} currentUserId={currentAdminId} />
        </div>

        <AdminTicketChatFooter
          ticketId={ticketId}
          status={ticket.status}
          isAssignedToMe={isAssignedToMe}
          currentAdminId={currentAdminId}
        />
      </DialogContent>
    </Dialog>
  );
}