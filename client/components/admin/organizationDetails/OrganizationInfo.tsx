"use client";

import Image from "next/image";
import { Building2, CalendarDays, Link2, Mail, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Organization } from "@/types/organization.type";

const STATUS_VARIANTS: Record<
  Organization["status"],
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className:
      "bg-green-500/10 text-green-600 hover:bg-green-500/10 dark:text-green-400",
  },
  suspended: {
    label: "Suspended",
    className: "bg-destructive/10 text-destructive hover:bg-destructive/10",
  },
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

interface OrganizationInfoProps {
  organization: Organization;
  totalCourses: number;
}

export default function OrganizationInfo({
  organization,
  totalCourses,
}: OrganizationInfoProps) {
  const statusConfig = STATUS_VARIANTS[organization.status];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* ==================== ORGANIZATION CARD ==================== */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <CardTitle className="truncate">{organization.name}</CardTitle>

              <p className="truncate text-xs text-muted-foreground">
                /{organization.slug}
              </p>
            </div>
          </div>

          <Badge variant="secondary" className={statusConfig.className}>
            {statusConfig.label}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <div>
            <p className="mb-1.5 text-sm font-medium text-foreground">
              Description
            </p>

            <p className="text-sm leading-6 text-muted-foreground">
              {organization.description || (
                <span className="italic">No description</span>
              )}
            </p>
          </div>

          {/* Meta */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Joined
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(organization.createdAt)}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" />
                Courses
              </p>

              <p className="mt-1 text-sm font-medium">{totalCourses} courses</p>
            </div>

            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                Last Update
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(organization.updatedAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ==================== INSTRUCTOR CARD ==================== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4 text-primary" />
            Instructor
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border bg-muted">
              {organization.instructor?.avatar?.url ? (
                <Image
                  src={organization.instructor.avatar.url}
                  alt={organization.instructor.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-base font-medium text-muted-foreground">
                  {organization.instructor?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">
                {organization.instructor?.name}
              </p>

              {organization.instructor?.role && (
                <p className="text-xs capitalize text-muted-foreground">
                  {organization.instructor.role}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />

              <span className="truncate">
                {organization.instructor?.email}
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Member since {formatDate(organization.instructor?.createdAt)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
