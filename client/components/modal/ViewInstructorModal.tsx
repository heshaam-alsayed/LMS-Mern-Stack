"use client";

import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  Clock,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { getShortName } from "@/app/utils/helper";
import useOrganizationInstructor from "@/customHooks/useOrganizationInstructor";
import { useModalBehavior } from "@/customHooks/useModalBehavior";

type Props = {
  id: string;
  organizationName?: string;
  isOpen: boolean;
  onClose: () => void;
};

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  active: {
    label: "Active",
    className:
      "bg-green-500/10 text-green-600 hover:bg-green-500/10 dark:text-green-400",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400",
  },
  suspended: {
    label: "Suspended",
    className: "bg-destructive/10 text-destructive hover:bg-destructive/10",
  },
};

const formatDate = (date?: string) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (date?: string) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-3.5 py-3">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
      <Icon className="h-4 w-4" />
    </div>

    <div className="min-w-0">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <p className="truncate text-sm font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

export default function ViewInstructorModal({
  id,
  organizationName,
  isOpen,
  onClose,
}: Props) {
  const { instructor, coursesCount, isLoading, isError, error, refetch } =
    useOrganizationInstructor({ id, enabled: isOpen });

  useModalBehavior({ isOpen, onClose });

  if (!isOpen) return null;

  const status = instructor?.status ?? "pending";

  const statusStyle = STATUS_STYLES[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground hover:bg-muted",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Instructor details"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <UserRound className="h-5 w-5 text-primary" />
              </div>

              <div className="pt-0.5">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Instructor Details
                </h2>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {organizationName
                    ? `Full profile of the ${organizationName} instructor.`
                    : "Full profile of the organization instructor."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>

          {isLoading && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-44 animate-pulse rounded bg-muted" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-[58px] animate-pulse rounded-xl bg-muted"
                  />
                ))}
              </div>
            </div>
          )}

          {isError && (
            <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Could not load the instructor
                  </p>

                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {error?.message || "Unexpected error."}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-4">
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Try again
              </Button>
            </div>
          )}

          {!isLoading && !isError && instructor && (
            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-muted/20 p-4">
                <Avatar className="h-16 w-16">
                  {instructor.avatar?.url && (
                    <AvatarImage
                      src={instructor.avatar.url}
                      alt={instructor.name}
                    />
                  )}

                  <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                    {getShortName(instructor.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-foreground">
                    {instructor.name}
                  </p>

                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {instructor.email}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <Badge
                      variant="secondary"
                      className="capitalize">
                      {instructor.role || "user"}
                    </Badge>

                    <Badge className={statusStyle.className}>
                      {statusStyle.label}
                    </Badge>

                    <Badge
                      variant={instructor.isVerified ? "default" : "outline"}
                      className="capitalize">
                      <ShieldCheck className="h-3 w-3" />
                      {instructor.isVerified ? "Verified" : "Unverified"}
                    </Badge>

                    {instructor.isDeleted && (
                      <Badge variant="destructive">Deleted</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailRow
                  icon={BookOpen}
                  label="Courses"
                  value={`${coursesCount} ${
                    coursesCount === 1 ? "course" : "courses"
                  }`}
                />

                <DetailRow
                  icon={CalendarDays}
                  label="Joined"
                  value={formatDate(instructor.createdAt)}
                />

                <DetailRow
                  icon={Clock}
                  label="Last Updated"
                  value={formatDateTime(instructor.updatedAt)}
                />

                <DetailRow
                  icon={UserRound}
                  label="Instructor ID"
                  value={instructor._id}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/20 px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
