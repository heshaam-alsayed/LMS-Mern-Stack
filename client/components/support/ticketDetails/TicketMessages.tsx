import { Download, FileText } from "lucide-react";

import { timeAgo } from "@/lib/utils";

import type { ITicketAttachment, ITicketMessage } from "@/types/ticket.type";

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

type AttachmentsProps = {
  attachments: ITicketAttachment[];
  isOwn: boolean;
};

const Attachments = ({ attachments, isOwn }: AttachmentsProps) => {
  if (attachments.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {attachments.map((attachment) => (
        <a
          key={attachment.publicId}
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex max-w-64 items-center gap-2 rounded-xl border px-3 py-2 text-xs transition-colors ${
            isOwn
              ? "border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20"
              : "border-border/60 bg-background/60 hover:bg-accent"
          }`}>
          {attachment.type?.startsWith("image/") ? (
            <img
              src={attachment.url}
              alt={attachment.name}
              className="size-6 shrink-0 rounded object-cover"
            />
          ) : (
            <FileText
              className={`size-4 shrink-0 ${
                isOwn ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}
            />
          )}

          <span className="truncate font-medium">{attachment.name}</span>

          <span
            className={`shrink-0 ${
              isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}>
            {formatSize(attachment.size)}
          </span>

          <Download
            className={`size-3.5 shrink-0 ${
              isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}
          />
        </a>
      ))}
    </div>
  );
};

type Props = {
  messages: ITicketMessage[];
  currentUserId?: string;
};

export default function TicketMessages({
  messages,
  currentUserId,
}: Props) {
  if (messages.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        No messages yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => {
        const sender =
          message.sender && typeof message.sender !== "string"
            ? message.sender
            : null;

        const isOwn = Boolean(
          currentUserId && sender && sender._id === currentUserId,
        );

        const senderName = isOwn
          ? "You"
          : (sender?.name ?? sender?.email ?? "Support");

        const attachments = message.attachments ?? [];

        return (
          <div
            key={message._id}
            className={`flex w-full ${isOwn ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[85%] flex-col sm:max-w-[75%]`}>
              <div
                className={`mb-1 flex items-center gap-2 text-[11px] ${
                  isOwn ? "justify-end" : "justify-start"
                }`}>
                <span
                  className={
                    isOwn ? "text-muted-foreground" : "font-medium text-foreground"
                  }>
                  {senderName}
                </span>

                <span className="text-muted-foreground">
                  {timeAgo(message.createdAt)}
                </span>
              </div>

              <div
                className={`rounded-2xl px-4 py-2.5 ${
                  isOwn
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-muted text-foreground"
                }`}>
                {message.message ? (
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {message.message}
                  </p>
                ) : null}

                <Attachments attachments={attachments} isOwn={isOwn} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}