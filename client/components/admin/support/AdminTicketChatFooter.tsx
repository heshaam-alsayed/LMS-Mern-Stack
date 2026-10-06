"use client";

import { useEffect, useState } from "react";
import { Hourglass, Info, Lock, Paperclip, Send } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { socket } from "@/lib/socket";
import PendingTicketFiles from "@/components/support/ticketDetails/PendingTicketFiles";

import type { ITicketMessage, TicketStatus } from "@/types/ticket.type";

import { toSocketTicketFiles } from "@/lib/ticketAttachments";

type Props = {
  ticketId: string;
  status: TicketStatus;
  isAssignedToMe: boolean;
  currentAdminId?: string;
};

export default function AdminTicketChatFooter({
  ticketId,
  status,
  isAssignedToMe,
  currentAdminId,
}: Props) {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const isOpen = status === "open";
  const isClosed = status === "closed";
  const isInProgress = status === "in_progress";

  const canSend = isInProgress && isAssignedToMe;
  const isDisabled = !canSend;
  const hasContent = Boolean(message.trim() || files.length > 0);

  const notice = isOpen
    ? "Accept this ticket before you can reply to the customer."
    : isClosed
      ? "This ticket is closed and the conversation is read-only."
      : isAssignedToMe
        ? "Live chat with the customer."
        : "This ticket is assigned to another admin, so the composer is disabled.";

  useEffect(() => {
    const handleError = (payload: any) => {
      if (payload?.message) {
        toast.error(payload.message);
      }
      setIsSubmitting(false);

      queryClient.setQueryData(
        ["admin-ticket-messages", ticketId],
        (oldData: any) => {
          if (oldData && !Array.isArray(oldData.messages)) return oldData;

          const messages = oldData?.messages ?? [];

          const remaining = messages.filter(
            (m: ITicketMessage) => !String(m._id).startsWith("temp-"),
          );

          if (remaining.length === messages.length) return oldData;

          return { success: true, messages: remaining };
        },
      );
    };

    socket.on("ticket:error", handleError);

    return () => {
      socket.off("ticket:error", handleError);
    };
  }, [ticketId, queryClient]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasContent || isDisabled || isSubmitting) return;

    setIsSubmitting(true);

    const clientId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `id-${Date.now()}`;

    const tempMessage: ITicketMessage = {
      _id: `temp-${clientId}`,
      ticket: ticketId,
      sender: {
        _id: currentAdminId ?? "",
        name: "You",
        email: "",
        role: "admin",
      },
      message: message.trim(),
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    queryClient.setQueryData(
      ["admin-ticket-messages", ticketId],
      (oldData: any) => {
        if (oldData && !Array.isArray(oldData.messages)) return oldData;

        const messages = oldData?.messages ? [...oldData.messages] : [];

        messages.push(tempMessage);

        return { success: true, messages };
      },
    );

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
    <div className="shrink-0 border-t px-3 py-2">
      <p className="mb-1.5 flex items-center gap-1.5 text-[10px] leading-tight text-muted-foreground">
        {isAssignedToMe ? (
          <Info className="size-3 shrink-0" />
        ) : (
          <Lock className="size-3 shrink-0" />
        )}

        {notice}
      </p>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <PendingTicketFiles
          inputId="ticket-chat-admin-files"
          disabled={isDisabled}
          files={files}
          onChange={setFiles}
        />

        <label
          htmlFor="ticket-chat-admin-files"
          onClick={(event) => {
            event.preventDefault();

            if (!isDisabled) {
              document.getElementById("ticket-chat-admin-files")?.click();
            }
          }}
          className={isDisabled ? "pointer-events-none" : "cursor-pointer"}>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Attach files"
            className="size-8"
            disabled={isDisabled}>
            <Paperclip className="size-3.5" />
          </Button>
        </label>

        <Textarea
          rows={1}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={isDisabled}
          placeholder={
            isOpen
              ? "Accept the ticket to start replying."
              : isAssignedToMe
                ? "Write your message"
                : "Chat is not available for this ticket."
          }
          aria-label="Admin reply"
          className="min-h-8 max-h-32 flex-1 resize-none py-1.5 text-xs"
        />

        <Button
          type="submit"
          size="icon"
          aria-label="Send message"
          className="size-8"
          disabled={isDisabled || !hasContent || isSubmitting}>
          <Send className="size-3.5" />
        </Button>
      </form>

      {isOpen ? (
        <p className="mt-2 flex items-center gap-1.5 text-[10px] leading-tight text-amber-600 dark:text-amber-400">
          <Hourglass className="size-3 shrink-0" />

          Chat unlocks as soon as the ticket is accepted.
        </p>
      ) : null}
    </div>
  );
}