"use client";

import ApplicationStatusSkeleton from "@/components/skeleton/ApplicationStatusSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStatusConfig } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Building2,
  CalendarDays,
  FileText,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import ApplicationInfoCard from "./ApplicationInfoCard";
import { getInstructorApplication } from "@/lib/api/checkOrganizationStatus";

export default function OrganizationApplicationContent() {
  const searchParams = useSearchParams();

  const email = searchParams.get("email")?.trim().toLowerCase() ?? "";

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["organization-application-status", email],
    queryFn: () => getInstructorApplication(email),
    enabled: Boolean(email),
    retry: 1,
  });

  const application = data?.application;
  // Missing email
  if (!email) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-10">
        <Card className="w-full max-w-md border-border/60 shadow-sm">
          <CardContent className="flex flex-col items-center px-6 py-10 text-center sm:px-10">
            {/* Icon */}
            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
              <Mail className="size-7 text-muted-foreground" />
            </div>

            {/* Content */}
            <div className="mt-6 space-y-2">
              <h2 className="text-xl font-semibold tracking-tight">
                Email Address Required
              </h2>

              <p className="text-sm leading-6 text-muted-foreground">
                We need your application email to look up your organization
                status. Please return to the login page and enter the email you
                used when applying.
              </p>
            </div>

            {/* Action */}
            <Button asChild className="mt-6 w-full gap-2">
              <Link href="/login">
                <Mail className="size-4" />
                Return to Login
              </Link>
            </Button>

            <p className="mt-4 text-xs text-muted-foreground">
              Already submitted an application? Use your registered email.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  // Loading
  if (isPending) {
    return <ApplicationStatusSkeleton />;
  }

  // Error
  if (isError) {
    return (
      <div className="flex min-h-[75vh] w-full items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md border-border/60 bg-card shadow-sm">
          <CardContent className="flex flex-col items-center px-6 py-10 text-center sm:px-10">
            {/* Error Icon */}
            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
              <RefreshCw className="size-7 text-muted-foreground" />
            </div>

            {/* Heading */}
            <div className="mt-6 space-y-2">
              <h2 className="text-xl font-semibold tracking-tight">
                Something went wrong
              </h2>

              <p className="text-sm leading-6 text-muted-foreground">
                We couldn&apos;t load your organization application. Please try
                again.
              </p>
            </div>

            {/* Error Message */}
            <div className="mt-5 w-full rounded-lg bg-muted/50 px-4 py-3 text-left">
              <p className="text-xs font-medium text-muted-foreground">
                Error message
              </p>

              <p className="mt-1.5 break-words text-sm leading-5 text-foreground/80">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred. Please try again."}
              </p>
            </div>

            {/* Retry */}
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-6 w-full gap-2">
              <RefreshCw
                className={`size-4 ${isFetching ? "animate-spin" : ""}`}
              />

              {isFetching ? "Retrying..." : "Try Again"}
            </Button>

            <p className="mt-4 text-xs text-muted-foreground">
              If the issue continues, please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Application not found
  if (!application) {
    return (
      <div className="mx-auto w-full max-w-2xl mt-10">
        <Card>
          <CardHeader>
            <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <FileText className="size-5" />
            </div>

            <CardTitle>No application found</CardTitle>

            <CardDescription>
              We couldn&apos;t find an organization application associated with
              this email address.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              <p className="text-muted-foreground">Email searched</p>

              <p className="mt-1 break-all font-medium">{email}</p>
            </div>

            <Button asChild variant="outline">
              <Link href="/organization/register">Submit an Application</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = getStatusConfig(application.status);
  const StatusIcon = status.icon;

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          Organization Application
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Check the current status of your application.
        </p>
      </div>

      {/* Main Card */}
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          {/* Organization */}
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Building2 className="size-5 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Organization
              </p>

              <h2 className="mt-1 truncate text-lg font-semibold">
                {application.organizationName}
              </h2>
            </div>
          </div>

          <div className="my-6 h-px bg-border" />

          {/* Status */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Application Status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`gap-1.5 px-3 py-1.5 ${status.className}`}>
                  <StatusIcon className="size-3.5" />
                  {status.label}
                </Badge>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-muted-foreground">Submitted</p>

              <p className="mt-1 text-sm font-medium">
                {format(new Date(application.createdAt), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-6 rounded-xl bg-muted/40 p-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {status.description}
            </p>
          </div>

          {/* Rejection */}
          {application.status === "rejected" && (
            <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive">
                Rejection reason
              </p>

              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {application.rejectionReason?.trim() ||
                  "No rejection reason was provided."}
              </p>
            </div>
          )}

          {/* Approved */}
          {application.status === "approved" && (
            <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-sm font-medium">Application approved</p>

              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Your organization application has been approved.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="size-3.5" />

          <span className="max-w-[220px] truncate">{email}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2">
          <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />

          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </div>
  );
}
