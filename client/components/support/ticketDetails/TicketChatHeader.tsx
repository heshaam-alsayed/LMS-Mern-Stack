import { ArrowLeft, Headphones, LifeBuoy } from "lucide-react";
import Link from "next/link";

import type { ReactNode } from "react";

import { TICKET_CATEGORY_LABELS } from "@/lib/ticketCategories";

import TicketStatusBadge from "./TicketStatusBadge";

import type { ITicket, ITicketUser } from "@/types/ticket.type";

const getUser = (value?: string | ITicketUser | null) => {
  if (!value) return null;

  if (typeof value === "string") return null;

  return value;
};

const getInitial = (name?: string) => (name?.[0] ?? "?").toUpperCase();

type ParticipantProps = {
  name: string;
  subtitle: string;
  icon?: ReactNode;
};

const Participant = ({ name, subtitle, icon }: ParticipantProps) => (
  <div className="flex min-w-0 items-center gap-2.5">
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
      {icon ?? getInitial(name)}
    </div>

    <div className="min-w-0">
      <p className="truncate text-xs font-medium text-foreground">{name}</p>

      <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
    </div>
  </div>
);

type Props = {
  ticket: ITicket;
};

export default function TicketChatHeader({ ticket }: Props) {
  const owner = getUser(ticket.user);
  const admin = getUser(ticket.assignedTo);

  const ownerName = owner?.name ?? "You";

  return (
    <header className="shrink-0 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="flex items-center gap-3 py-3">
          <Link
            href="/support/create-ticket"
            aria-label="Back to support"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <ArrowLeft className="size-4" />
          </Link>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold sm:text-base">
              {ticket.subject}
            </h1>

            <p className="truncate font-mono text-[11px] text-muted-foreground">
              #{ticket._id}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <TicketStatusBadge status={ticket.status} />

            <span className="hidden rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
              {TICKET_CATEGORY_LABELS[ticket.category] ?? ticket.category}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t py-2.5">
          <Participant
            name={ownerName}
            subtitle="Ticket owner"
            icon={getInitial(ownerName)}
          />

          <div className="hidden size-7 items-center justify-center rounded-full bg-muted text-muted-foreground sm:flex">
            <LifeBuoy className="size-3.5" />
          </div>

          {admin ? (
            <Participant
              name={admin.name || admin.email}
              subtitle="Assigned admin"
              icon={getInitial(admin.name || admin.email)}
            />
          ) : (
            <Participant
              name="Support team"
              subtitle="Waiting for assignment"
              icon={<Headphones className="size-3.5" />}
            />
          )}
        </div>
      </div>
    </header>
  );
}