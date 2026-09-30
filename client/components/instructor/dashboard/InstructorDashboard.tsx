"use client";

import Link from "next/link";
import { Building2, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import useMyOrganizationDashboardStatistics from "@/customHooks/useMyOrganizationDashboardStatistics";

import AnalyticsError from "@/components/instructor/analytics/AnalyticsError";

import InstructorDashboardSkeleton from "./InstructorDashboardSkeleton";
import InstructorDashboardStats from "./InstructorDashboardStats";
import InstructorCoursePerformance from "./InstructorCoursePerformance";
import InstructorRecentActivity from "./recentActivity/InstructorRecentActivity";

const NO_ORGANIZATION_ERROR = "No organization is linked to this account";

const QUICK_LINKS = [
  { label: "Courses", href: "/instructor/organization-courses" },
  { label: "Orders", href: "/instructor/organization-orders" },
  { label: "Students", href: "/instructor/organization-students" },
  { label: "Analytics", href: "/instructor/analytics/courses" },
];

export default function InstructorDashboard() {
  const { organization, statistics, isLoading, isError, error, refetch } =
    useMyOrganizationDashboardStatistics();

  if (isLoading) {
    return <InstructorDashboardSkeleton />;
  }

  if (isError) {
    const isMissing = error?.message === NO_ORGANIZATION_ERROR;

    if (!isMissing) {
      return (
        <AnalyticsError
          message={
            error?.message || "Error loading your dashboard statistics."
          }
          onRetry={refetch}
        />
      );
    }

    return (
      <div className="rounded-2xl border border-border bg-background">
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              No organization linked
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              {error?.message}
            </p>
          </div>

          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (!statistics) return null;

  const isSuspended = organization?.status === "suspended";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-background p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Dashboard
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {organization?.name}
              </h1>

              <Badge
                variant="secondary"
                className={
                  isSuspended
                    ? "rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 hover:bg-amber-500/10 dark:text-amber-400"
                    : "rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                }>
                {organization?.status}
              </Badge>
            </div>

            {organization?.description ? (
              <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
                {organization.description}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <InstructorDashboardStats statistics={statistics} />

      <InstructorCoursePerformance />

      <InstructorRecentActivity />

      <div className="flex flex-wrap gap-2">
        {QUICK_LINKS.map((link) => (
          <Button key={link.href} asChild variant="outline" size="sm">
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
