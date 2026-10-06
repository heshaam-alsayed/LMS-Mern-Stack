"use client";

import {
  ArrowRight,
  Clock,
  History,
  Inbox,
  Lock,
  Paperclip,
  Tag,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import TicketStatusBadge from "@/components/support/ticketDetails/TicketStatusBadge";
import { TICKET_CATEGORY_LABELS } from "@/lib/ticketCategories";
import { timeAgo } from "@/lib/utils";

import type { ITicket } from "@/types/ticket.type";

const getAssignedTo = (ticket: ITicket) =>
  ticket.assignedTo && typeof ticket.assignedTo !== "string"
    ? ticket.assignedTo
    : null;

type Props = {
  ticket: ITicket;
};

export default function UserSupportTicketCard({ ticket }: Props) {
  const assignedTo = getAssignedTo(ticket);

  const isClosed = ticket.status === "closed";

  const attachmentCount = ticket.attachments?.length ?? 0;

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {ticket.subject}
          </h3>

          <p className="mt-1 font-mono text-[11px] font-medium text-foreground/60">
            #{ticket._id}
          </p>
        </div>

        <TicketStatusBadge status={ticket.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
          <Tag className="size-3" />

          {TICKET_CATEGORY_LABELS[ticket.category] ?? ticket.category}
        </span>

        {assignedTo ? (
          <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-[11px] font-semibold text-foreground/80">
            <UserRound className="size-3" />

            {assignedTo.name || assignedTo.email}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-foreground/75">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5 text-primary/80" />

          Created {timeAgo(ticket.createdAt)}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <History className="size-3.5 text-primary/80" />

          Updated {timeAgo(ticket.updatedAt)}
        </span>

        {attachmentCount > 0 ? (
          <span className="inline-flex items-center gap-1.5">
            <Paperclip className="size-3.5 text-primary/80" />

            {attachmentCount} attachment{attachmentCount === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 border-t pt-3">
        <p className="truncate text-xs font-semibold text-foreground/80">
          {assignedTo
            ? `Support: ${assignedTo.name || assignedTo.email}`
            : "Waiting for support response"}
        </p>

        {isClosed ? (
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-foreground/60">
            <Lock className="size-3.5" />

            Ticket closed
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
            Open chat

            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </>
  );

  if (isClosed) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 opacity-70">
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/support/tickets/${ticket._id}`}
      className="group flex flex-col gap-3 rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent/40">
      {body}
    </Link>
  );
}

export function UserTicketsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Inbox className="size-6" />
      </div>

      <div>
        <p className="text-sm font-medium">No tickets found</p>

        <p className="mt-1 text-xs text-muted-foreground">
          Tickets matching this filter will appear here.
        </p>
      </div>
    </div>
  );
}