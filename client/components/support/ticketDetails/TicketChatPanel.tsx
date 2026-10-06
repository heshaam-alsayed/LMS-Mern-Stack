"use client";

import { useEffect, useState } from "react";
import { Hourglass, Lock, Paperclip, Send } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { socket } from "@/lib/socket";
import PendingTicketFiles from "@/components/support/ticketDetails/PendingTicketFiles";

import type { ITicketMessage, TicketStatus } from "@/types/ticket.type";

import { toSocketTicketFiles } from "@/lib/ticketAttachments";

import type { PendingTicketFile } from "@/lib/ticketAttachments";

type Props = {
  ticketId: string;
  status: TicketStatus;
  hasAssignedAdmin: boolean;
  currentUserId?: string;
};

export default function TicketChatPanel({
  ticketId,
  status,
  hasAssignedAdmin,
  currentUserId,
}: Props) {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
const [files, setFiles] = useState<File[]>([]);

  const isWaitingForAdmin = status === "open" && !hasAssignedAdmin;
  const isClosed = status === "closed";
  const isInProgress = status === "in_progress";
  const isDisabled = isWaitingForAdmin || isClosed;
const hasContent = Boolean(
  message.trim() || files.length > 0,
);
useEffect(() => {
  const onNewMessage = (message: ITicketMessage) => {
    if (String(message.ticket) !== ticketId) return;

    queryClient.setQueryData(["ticket-messages", ticketId], (oldData: any) => {
      if (oldData && !Array.isArray(oldData.messages)) return oldData;

      const messages = oldData?.messages ? [...oldData.messages] : [];

      if (message.clientId) {
        const tempIndex = messages.findIndex(
          (m: ITicketMessage) => m._id === `temp-${message.clientId}`,
        );

        if (tempIndex !== -1) {
          messages[tempIndex] = message;

          return { success: true, messages };
        }
      }

      const messageAlreadyExists = messages.some(
        (oldMessage: ITicketMessage) => oldMessage._id === message._id,
      );

      if (messageAlreadyExists) return oldData;

      messages.push(message);

      return { success: true, messages };
    });
  };

  const removePendingMessages = () => {
    queryClient.setQueryData(["ticket-messages", ticketId], (oldData: any) => {
      if (oldData && !Array.isArray(oldData.messages)) return oldData;

      const messages = oldData?.messages ?? [];

      const remaining = messages.filter(
        (m: ITicketMessage) => !String(m._id).startsWith("temp-"),
      );

      if (remaining.length === messages.length) return oldData;

      return { success: true, messages: remaining };
    });
  };

  const onSocketError = (error: { message?: string }) => {
    if (error?.message) {
      toast.error(error.message);
    }

    setIsSubmitting(false);
    removePendingMessages();
  };

  socket.on("ticket:message", onNewMessage);
  socket.on("ticket:error", onSocketError);

  return () => {
    socket.off("ticket:message", onNewMessage);
    socket.off("ticket:error", onSocketError);
  };
}, [ticketId, queryClient]);

  useEffect(() => {
    if (isInProgress) {
      socket.emit("ticket:join", ticketId);
    }

    return () => {
      if (isInProgress) {
        socket.emit("ticket:leave", ticketId);
      }
    };
  }, [ticketId, isInProgress]);

  const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  if (!hasContent || isDisabled || isSubmitting) {
    return;
  }

  setIsSubmitting(true);

  const clientId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `id-${Date.now()}`;

  const tempMessage: ITicketMessage = {
    _id: `temp-${clientId}`,
    ticket: ticketId,
    sender: {
      _id: currentUserId ?? "",
      name: "You",
      email: "",
      role: "user",
    },
    message: message.trim(),
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  queryClient.setQueryData(["ticket-messages", ticketId], (oldData: any) => {
    if (oldData && !Array.isArray(oldData.messages)) return oldData;

    const messages = oldData?.messages ? [...oldData.messages] : [];

    messages.push(tempMessage);

    return { success: true, messages };
  });

  const filePayload = await toSocketTicketFiles(files);

  socket.emit("ticket:message", {
    ticketId,
    message: message.trim(),
    files: filePayload,
    clientId,
  });

  setMessage("");
  setFiles([]);
  setIsSubmitting(false);
};

  return (
    <div>
      {isWaitingForAdmin ? (
        <div
          role="status"
          className="mb-3 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
          <Hourglass className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />

          <div>
            <p className="text-sm font-medium text-foreground">
              Waiting for an admin to accept your ticket.
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              The chat unlocks automatically as soon as an admin accepts and
              replies to your ticket.
            </p>
          </div>
        </div>
      ) : null}

      {isClosed ? (
        <div
          role="status"
          className="mb-3 flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-3">
          <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div>
            <p className="text-sm font-medium text-foreground">
              This ticket is closed.
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              The conversation is read-only and no new messages can be sent.
            </p>
          </div>
        </div>
      ) : null}

      <PendingTicketFiles
  inputId="ticket-chat-user-files"
  disabled={isDisabled}
  files={files}
  onChange={setFiles}
/>
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <label
          htmlFor="ticket-chat-user-files"
          onClick={(event) => {
            event.preventDefault();

            if (!isDisabled) {
              document.getElementById("ticket-chat-user-files")?.click();
            }
          }}
          className={isDisabled ? "pointer-events-none" : "cursor-pointer"}>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Attach files"
            disabled={isDisabled}>
            <Paperclip className="size-4" />
          </Button>
        </label>

        <Textarea
          rows={1}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={isDisabled}
          placeholder={
            isWaitingForAdmin
              ? "Waiting for an admin to accept your ticket."
              : isClosed
                ? "This conversation is closed."
                : "Write your message"
          }
          aria-label="Ticket message"
          className="max-h-32 min-h-9 flex-1 resize-none"
        />

        <Button
          type="submit"
          size="icon"
          aria-label="Send message"
          disabled={isDisabled || !hasContent || isSubmitting}>
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}