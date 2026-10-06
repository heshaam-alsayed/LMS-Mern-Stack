"use client";

import type { ReactNode } from "react";
import { ArrowLeft, Headphones, LifeBuoy } from "lucide-react";
import Link from "next/link";

import type { ITicket } from "@/types/ticket.type";

const getUser = (value: ITicket["user"]) =>
  value && typeof value !== "string" ? value : null;

const getAssignedTo = (value: ITicket["assignedTo"]) =>
  value && typeof value !== "string" ? value : null;

const getInitial = (name?: string) => (name?.[0] ?? "?").toUpperCase();

type ParticipantProps = {
  name: string;
  subtitle: string;
  icon?: ReactNode;
};

const Participant = ({ name, subtitle, icon }: ParticipantProps) => (
  <div className="flex min-w-0 items-center gap-2">
    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
      {icon ?? getInitial(name)}
    </div>

    <div className="min-w-0">
      <p className="truncate text-[11px] font-medium leading-tight">{name}</p>

      <p className="truncate text-[10px] leading-tight text-muted-foreground">
        {subtitle}
      </p>
    </div>
  </div>
);

type Props = {
  ticket: ITicket;
  currentAdminId?: string;
};

export default function AdminTicketChatHeader({
  ticket,
  currentAdminId,
}: Props) {
  const owner = getUser(ticket.user);

  const assignedTo = getAssignedTo(ticket.assignedTo);

  const senderName = owner ? owner.name || owner.email : "Unknown user";

  const isMine = assignedTo?._id === currentAdminId;

  return (
    <div className="flex shrink-0 items-center gap-2 border-b bg-muted/20 px-3 py-2">
      <Link
        href="/admin/support/tickets"
        aria-label="Back to support tickets"
        className="hidden size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:flex">
        <ArrowLeft className="size-3.5" />
      </Link>

      <Participant
        name={senderName}
        subtitle="Sender"
        icon={getInitial(senderName)}
      />

      <div className="hidden size-6 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground sm:flex">
        <LifeBuoy className="size-3" />
      </div>

      {assignedTo ? (
        <Participant
          name={
            isMine
              ? `${assignedTo.name || assignedTo.email} (you)`
              : (assignedTo.name || assignedTo.email)
          }
          subtitle="Receiver"
          icon={getInitial(assignedTo.name || assignedTo.email)}
        />
      ) : (
        <Participant
          name="Unassigned"
          subtitle="Receiver"
          icon={<Headphones className="size-3" />}
        />
      )}
    </div>
  );
}