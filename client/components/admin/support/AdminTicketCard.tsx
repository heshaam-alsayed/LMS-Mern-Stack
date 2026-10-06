"use client";

import {
  ArrowRight,
  Clock,
  History,
  Inbox,
  Lock,
  Paperclip,
  Tag,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TicketStatusBadge from "@/components/support/ticketDetails/TicketStatusBadge";
import { getShortName } from "@/app/utils/helper";
import { canAdminViewTicket, isAssignedToAdmin } from "@/lib/ticketAccess";
import { TICKET_CATEGORY_LABELS } from "@/lib/ticketCategories";
import { timeAgo } from "@/lib/utils";

import type { ITicket } from "@/types/ticket.type";

const getUser = (ticket: ITicket) =>
  ticket.user && typeof ticket.user !== "string" ? ticket.user : null;

const getAssignedTo = (ticket: ITicket) =>
  ticket.assignedTo && typeof ticket.assignedTo !== "string"
    ? ticket.assignedTo
    : null;

type Props = {
  ticket: ITicket;
  currentAdminId?: string;
};

export default function AdminTicketCard({ ticket, currentAdminId }: Props) {
  const owner = getUser(ticket);

  const assignedTo = getAssignedTo(ticket);

  const canView = canAdminViewTicket(ticket, currentAdminId);

  const isMine = isAssignedToAdmin(ticket, currentAdminId);

  const attachmentCount = ticket.attachments?.length ?? 0;

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar size="lg" className="mt-0.5 shrink-0">
            {owner?.avatar?.url ? (
              <AvatarImage src={owner.avatar.url} alt={owner.name || "User"} />
            ) : null}

            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
              {getShortName(owner?.name || owner?.email || "U")}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {ticket.subject}
            </h3>

            <p className="mt-1 truncate font-mono text-[11px] font-medium text-foreground/60">
              #{ticket._id}
            </p>
          </div>
        </div>

        <TicketStatusBadge status={ticket.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
          <Tag className="size-3" />

          {TICKET_CATEGORY_LABELS[ticket.category] ?? ticket.category}
        </span>

        {attachmentCount > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-[11px] font-semibold text-foreground/80">
            <Paperclip className="size-3" />

            {attachmentCount} attachment{attachmentCount === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-col gap-1.5 text-xs font-medium text-foreground/75">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5 text-primary/80" />

          Created {timeAgo(ticket.createdAt)}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <History className="size-3.5 text-primary/80" />

          Updated {timeAgo(ticket.updatedAt)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 border-t pt-3">
        <div className="flex min-w-0 items-center gap-2">
          {assignedTo ? (
            <>
              <Avatar size="sm" className="shrink-0">
                {assignedTo.avatar?.url ? (
                  <AvatarImage
                    src={assignedTo.avatar.url}
                    alt={assignedTo.name || "Support"}
                  />
                ) : null}

                <AvatarFallback className="text-[10px] font-semibold">
                  {getShortName(assignedTo.name || assignedTo.email || "S")}
                </AvatarFallback>
              </Avatar>

              <p className="truncate text-xs font-semibold text-foreground/80">
                {assignedTo.name || assignedTo.email}
                {isMine ? " (you)" : ""}
              </p>
            </>
          ) : (
            <p className="truncate text-xs font-semibold text-foreground/80">
              {ticket.status === "open" ? "Unassigned" : "No support assigned"}
            </p>
          )}
        </div>

        {canView ? (
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
            View Ticket

            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-foreground/60">
            <Lock className="size-3.5" />

            Assigned to another admin
          </span>
        )}
      </div>
    </>
  );

  if (!canView) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 opacity-70">
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/admin/support/tickets/${ticket._id}`}
      className="group flex flex-col gap-3 rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent/40">
      {body}
    </Link>
  );
}

export function AdminTicketsEmpty() {
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