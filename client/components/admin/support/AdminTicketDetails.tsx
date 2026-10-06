"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Clock,
  File,
  LifeBuoy,
  Mail,
  MessageSquare,
  Paperclip,
  RotateCcw,
  UserRound,
  XCircle,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TicketStatusBadge from "@/components/support/ticketDetails/TicketStatusBadge";
import { useAcceptTicket } from "@/hooks/support/useAcceptTicket";
import { useAdminTicketDetails } from "@/hooks/support/useAdminTicketDetails";
import { useCloseTicket } from "@/hooks/support/useCloseTicket";
import { useAppSelector } from "@/redux/hooks";
import { isAssignedToAdmin } from "@/lib/ticketAccess";
import { TICKET_CATEGORY_LABELS } from "@/lib/ticketCategories";
import { timeAgo } from "@/lib/utils";

import AdminTicketChatModal from "./AdminTicketChatModal";

import type { ITicket } from "@/types/ticket.type";

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

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
  ticketId: string;
};

export default function AdminTicketDetails({ ticketId }: Props) {
  const { user } = useAppSelector((state) => state.auth);

  const [chatOpen, setChatOpen] = useState(false);

  const currentAdminId = user?._id;

  const { ticket, messages, isLoading, isError, error, refetch } =
    useAdminTicketDetails(ticketId);

  const { mutate, isPending } = useAcceptTicket(ticketId);

  const { mutate: closeMutate, isPending: isClosing } =
    useCloseTicket(ticketId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-start gap-3">
            <Skeleton className="size-9 rounded-lg" />

            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />

              <Skeleton className="h-3.5 w-24" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-md" />

              <Skeleton className="h-9 w-20 rounded-md" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="size-4 rounded" />

            <Skeleton className="h-4 w-24" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </div>

        <div>
          <p className="text-lg font-semibold">Cannot open this ticket</p>

          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading this ticket."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={refetch}>
            <RotateCcw className="size-4" />

            Try again
          </Button>

          <Button variant="ghost" asChild>
            <Link href="/admin/support/tickets">
              <ArrowLeft className="size-4" />

              Back to tickets
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const owner = getUser(ticket.user);

  const assignedTo = getAssignedTo(ticket.assignedTo);

  const isOpen = ticket.status === "open";

  const isInProgress = ticket.status === "in_progress";

  const isMine = isAssignedToAdmin(ticket, currentAdminId);

  const attachments = ticket.attachments ?? [];

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-2xl border bg-card">
          <div className="flex flex-col gap-5 p-5">
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

                {isInProgress && isMine && (
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isClosing}
                    onClick={() => closeMutate()}
                    className="gap-1.5">
                    {isClosing ? (
                      <>
                        <span className="size-3.5 animate-spin rounded-full border-2 border-destructive/30 border-t-destructive" />

                        Closing...
                      </>
                    ) : (
                      <>
                        <XCircle className="size-4" />

                        <span className="hidden sm:inline">Close Ticket</span>

                        <span className="sm:hidden">Close</span>
                      </>
                    )}
                  </Button>
                )}

                <Button
                  size="sm"
                  variant={isOpen ? "outline" : "default"}
                  onClick={() => setChatOpen(true)}
                  className="gap-1.5">
                  <MessageSquare className="size-4" />

                  <span className="hidden sm:inline">Open Chat</span>

                  <span className="sm:hidden">Chat</span>
                </Button>
              </div>
            </div>

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

                <InfoItem
                  icon={<LifeBuoy className="size-4" />}
                  label="Category">
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

                <InfoItem icon={<Clock className="size-4" />} label="Last Updated">
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
                  {attachments.length} file{attachments.length === 1 ? "" : "s"}
                </InfoItem>

                <InfoItem icon={<Check className="size-4" />} label="Chat Access">
                  {isOpen
                    ? "Waiting for acceptance"
                    : isMine
                      ? "Available"
                      : "Assigned to another admin"}
                </InfoItem>
              </div>
            </div>
          </div>
        </div>

        {attachments.length > 0 && (
          <div className="rounded-2xl border bg-card">
            <div className="flex items-center gap-2 border-b px-5 py-4">
              <Paperclip className="size-4 text-muted-foreground" />

              <h2 className="text-sm font-semibold">Attachments</h2>

              <span className="text-xs text-muted-foreground">
                ({attachments.length})
              </span>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {attachments.map((attachment, index) => {
                const isImage = attachment.type?.startsWith("image/");

                return (
                  <a
                    key={attachment.publicId || index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-w-0 items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-accent">
                    {isImage ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="size-9 shrink-0 rounded-lg object-cover ring-1 ring-border"
                      />
                    ) : (
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                        <File className="size-4 text-muted-foreground" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">
                        {attachment.name}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                        {attachment.type}

                        {attachment.size
                          ? ` • ${formatBytes(attachment.size)}`
                          : ""}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <AdminTicketChatModal
        ticket={ticket}
        messages={messages}
        currentAdminId={currentAdminId}
        open={chatOpen}
        onOpenChange={setChatOpen}
      />
    </>
  );
}