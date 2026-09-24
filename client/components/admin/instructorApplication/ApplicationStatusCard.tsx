import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    className:
      "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

export default function ApplicationStatusCard({
  application,
}: Props) {
  const config = statusConfig[application.status];

  const Icon = config.icon;

  const submittedDate = format(
    new Date(application.createdAt),
    "MMM dd, yyyy",
  );

  const reviewedDate = application.reviewedAt
    ? format(
        new Date(application.reviewedAt),
        "MMM dd, yyyy",
      )
    : null;

  const reviewer =
    application.reviewedBy &&
    typeof application.reviewedBy !== "string"
      ? application.reviewedBy
      : null;

  return (
    <Card className="border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-base">
          Application Status
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Current Application Status
          </p>

          <Badge
            variant="outline"
            className={`mt-2 gap-1.5 rounded-md px-2.5 py-1 ${config.className}`}
          >
            <Icon className="size-3.5" />
            {config.label}
          </Badge>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Submitted Date
          </p>

          <div className="mt-2 flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="size-4 text-muted-foreground" />
            {submittedDate}
          </div>
        </div>

        {reviewedDate && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Reviewed Date
            </p>

            <div className="mt-2 flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="size-4 text-muted-foreground" />
              {reviewedDate}
            </div>
          </div>
        )}

        {reviewer && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Reviewed By
            </p>

            <p className="mt-1.5 text-sm font-semibold">
              {reviewer.name}
            </p>

            {reviewer.email && (
              <p className="mt-1 text-xs text-muted-foreground">
                {reviewer.email}
              </p>
            )}
          </div>
        )}

        {application.status === "rejected" &&
          application.rejectionReason && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                Rejection Reason
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {application.rejectionReason}
              </p>
            </div>
          )}
      </CardContent>
    </Card>
  );
}