import { Clock, Hash, Layers, Tag, UserRound } from "lucide-react";

import type { ReactNode } from "react";

import { timeAgo } from "@/lib/utils";
import { TICKET_CATEGORY_LABELS } from "@/lib/ticketCategories";

import TicketStatusBadge from "./TicketStatusBadge";

import type { ITicket, ITicketUser } from "@/types/ticket.type";

const getUserName = (value: string | ITicketUser | null) => {
  if (!value) return null;

  if (typeof value === "string") return null;

  return value.name || value.email;
};

type RowProps = {
  icon: ReactNode;
  label: string;
  children: ReactNode;
};

const Row = ({ icon, label, children }: RowProps) => (
  <div className="flex items-start justify-between gap-4 py-3">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {icon}

      <span>{label}</span>
    </div>

    <div className="text-right text-sm font-medium text-foreground">
      {children}
    </div>
  </div>
);

type Props = {
  ticket: ITicket;
};

export default function TicketInfoCard({ ticket }: Props) {
  const assignedToName = getUserName(ticket.assignedTo);
  const createdByName = getUserName(ticket.user);

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h2 className="text-base font-semibold">Ticket information</h2>

      <div className="mt-2 divide-y">
        <Row icon={<Hash className="size-4" />} label="Ticket ID">
          <span className="font-mono text-xs">{ticket._id}</span>
        </Row>

        <Row icon={<Tag className="size-4" />} label="Category">
          {TICKET_CATEGORY_LABELS[ticket.category] ?? ticket.category}
        </Row>

        <Row icon={<Layers className="size-4" />} label="Status">
          <TicketStatusBadge status={ticket.status} />
        </Row>

        <Row icon={<Clock className="size-4" />} label="Created">
          {timeAgo(ticket.createdAt)}
        </Row>

        <Row icon={<UserRound className="size-4" />} label="Created by">
          {createdByName ?? "You"}
        </Row>

        <Row icon={<UserRound className="size-4" />} label="Assigned to">
          {assignedToName ?? (
            <span className="text-muted-foreground">Not assigned yet</span>
          )}
        </Row>
      </div>
    </div>
  );
}