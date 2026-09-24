import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  UserRound,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type {
  InstructorApplication,
  InstructorApplicationStatus,
} from "@/types/instructorApplication.type";

type Props = {
  application: InstructorApplication;
};

const statusConfig: Record<
  InstructorApplicationStatus,
  {
    label: string;
    icon: typeof Clock3;
    className: string;
  }
> = {
  pending: {
    label: "Pending Review",
    icon: Clock3,
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

function ApplicationStatusBadge({
  status,
}: {
  status: InstructorApplicationStatus;
}) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`shrink-0 gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${config.className}`}>
      <Icon className="size-3.5" />
      {config.label}
    </Badge>
  );
}

export default function InstructorApplicationCard({ application }: Props) {
  const user = typeof application.user === "string" ? null : application.user;

  const submittedDate = format(new Date(application.createdAt), "MMM dd, yyyy");

  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardContent className="p-0">
        {/* Header */}
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserRound className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user?.name || "Unknown Applicant"}
                </p>

                <div className="mt-1 flex min-w-0 items-center gap-1.5">
                  <Mail className="size-3.5 shrink-0 text-muted-foreground" />

                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email || "No email available"}
                  </span>
                </div>
              </div>
            </div>

            <ApplicationStatusBadge status={application.status} />
          </div>
        </div>

        {/* Application Details */}
        <div className="px-5 py-5">
          <div className="grid gap-5">
            {/* Organization */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />

                <span className="text-xs font-medium text-muted-foreground">
                  Organization
                </span>
              </div>

              <p className="text-sm font-semibold text-foreground">
                {application.organizationName}
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Organization Description
              </p>

              {application.organizationDescription ? (
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {application.organizationDescription}
                </p>
              ) : (
                <p className="text-sm italic text-muted-foreground/60">
                  No description provided.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-border bg-muted/20 px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <span className="text-xs text-muted-foreground">Submitted</span>

              <span className="ml-1.5 text-xs font-medium text-foreground">
                {submittedDate}
              </span>
            </div>
          </div>

          <Button asChild size="sm" className="shrink-0 gap-2">
            <Link href={`/admin/instructor-applications/${application._id}`}>
              View Application
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
