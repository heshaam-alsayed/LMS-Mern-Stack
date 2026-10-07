"use client";

import {
  ArrowLeft,
  Check,
  Clock,
  File,
  LifeBuoy,
  Mail,
  MessageSquare,
  Paperclip,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import TicketStatusBadge from "@/components/support/ticketDetails/TicketStatusBadge";
import { useAcceptTicket } from "@/hooks/support/useAcceptTicket";
import { isAssignedToAdmin } from "@/lib/ticketAccess";
import { TICKET_CATEGORY_LABELS } from "@/lib/ticketCategories";
import { timeAgo } from "@/lib/utils";

import type { ITicket } from "@/types/ticket.type";

const getUser = (value: ITicket["user"]) =>
  value && typeof value !== "string" ? value : null;

const getAssignedTo = (value: ITicket["assignedTo"]) =>
  value && typeof value !== "string" ? value : null;

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
};

const InfoItem = ({ icon, label, children }: InfoItemProps) => (
  <div className="flex min-w-0 items-start gap-3 rounded-xl border bg-background/50 p-4">
    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
      {icon}
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <div className="mt-1 truncate text-sm font-medium">{children}</div>
    </div>
  </div>
);

type Props = {
  ticket: ITicket;
  currentAdminId?: string;
  onOpenChat: () => void;
};

export default function AdminTicketHeader({
  ticket,
  currentAdminId,
  onOpenChat,
}: Props) {
  const { mutate, isPending } = useAcceptTicket(ticket._id);

  const owner = getUser(ticket.user);
  const assignedTo = getAssignedTo(ticket.assignedTo);

  const isOpen = ticket.status === "open";
  const isMine = isAssignedToAdmin(ticket, currentAdminId);

  return (
    <div className="space-y-4">
      {/* Ticket Header */}
      <div className="rounded-2xl border bg-card">
        <div className="flex flex-col gap-5 p-5">
          {/* Title + Actions */}
          <div className="flex items-start gap-3">
            <Link
              href="/admin/support/tickets"
              aria-label="Back to support tickets"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <ArrowLeft className="size-4" />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight">
                  {ticket.subject}
                </h1>

                <TicketStatusBadge status={ticket.status} />
              </div>

              <p className="mt-1 font-mono text-xs text-muted-foreground">
                Ticket #{ticket._id}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              {isOpen && (
                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={() => mutate()}
                  className="gap-1.5">
                  {isPending ? (
                    <>
                      <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <Check className="size-4" />
                      <span className="hidden sm:inline">Accept Ticket</span>
                      <span className="sm:hidden">Accept</span>
                    </>
                  )}
                </Button>
              )}

              <Button
                size="sm"
                variant={isOpen ? "outline" : "default"}
                onClick={onOpenChat}
                className="gap-1.5">
                <MessageSquare className="size-4" />

                <span className="hidden sm:inline">Open Chat</span>

                <span className="sm:hidden">Chat</span>
              </Button>
            </div>
          </div>

          {/* Ticket Details */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <LifeBuoy className="size-4 text-muted-foreground" />

              <h2 className="text-sm font-semibold">Ticket Details</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                icon={<UserRound className="size-4" />}
                label="Customer">
                {owner?.name || "Unknown"}
              </InfoItem>

              <InfoItem icon={<Mail className="size-4" />} label="Email">
                {owner?.email || "Unknown"}
              </InfoItem>

              <InfoItem icon={<LifeBuoy className="size-4" />} label="Category">
                {TICKET_CATEGORY_LABELS[ticket.category] ?? ticket.category}
              </InfoItem>

              <InfoItem
                icon={<UserRound className="size-4" />}
                label="Assigned Admin">
                {assignedTo ? (
                  <>
                    {assignedTo.name || assignedTo.email}

                    {isMine && <span className="ml-1 text-primary">(You)</span>}
                  </>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </InfoItem>

              <InfoItem icon={<Clock className="size-4" />} label="Created">
                {timeAgo(ticket.createdAt)}
              </InfoItem>

              <InfoItem
                icon={<Clock className="size-4" />}
                label="Last Updated">
                {ticket.updatedAt
                  ? timeAgo(ticket.updatedAt)
                  : timeAgo(ticket.createdAt)}
              </InfoItem>

              <InfoItem
                icon={<MessageSquare className="size-4" />}
                label="Ticket ID">
                <span className="font-mono text-xs">{ticket._id}</span>
              </InfoItem>

              <InfoItem
                icon={<Paperclip className="size-4" />}
                label="Attachments">
                {ticket.attachments?.length ?? 0} files
              </InfoItem>

              <InfoItem icon={<Check className="size-4" />} label="Chat Access">
                {ticket.status === "open"
                  ? "Waiting for acceptance"
                  : isMine
                    ? "Available"
                    : "Assigned to another admin"}
              </InfoItem>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments */}
      {(ticket?.attachments?.length || 0) > 0 && (
        <div className="rounded-2xl border bg-card">
          <div className="flex items-center gap-2 border-b px-5 py-4">
            <Paperclip className="size-4 text-muted-foreground" />

            <h2 className="text-sm font-semibold">Attachments</h2>

            <span className="text-xs text-muted-foreground">
              ({ticket.attachments?.length})
            </span>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ticket.attachments?.map((attachment, index) => (
              <a
                key={attachment.publicId || index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-accent">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <File className="size-4 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">
                    {attachment.name}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                    {attachment.type}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
