"use client";

import { useState } from "react";
import { Award, Building2, CalendarDays, Clock, Mail } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { OrganizationCertificate } from "@/types/certificate.type";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

interface OrganizationCertificateCardProps {
  certificate: OrganizationCertificate;
}

export default function OrganizationCertificateCard({
  certificate,
}: OrganizationCertificateCardProps) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  const { course, user, learningHours } = certificate;

  const thumbnail = course?.thumbnail;

  const studentName = certificate.studentName || user?.name || "Unknown student";

  const organizationName =
    typeof certificate.organization === "object"
      ? certificate.organization?.name
      : null;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-32 w-full overflow-hidden bg-primary/5">
        {thumbnail && !thumbnailFailed ? (
          <img
            src={thumbnail.url}
            alt={certificate.courseTitle}
            onError={() => setThumbnailFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Award className="h-9 w-9 text-primary/40" />
          </div>
        )}

        <Badge
          variant="secondary"
          className="absolute left-3 top-3 rounded-md bg-background/90 font-mono text-[11px] font-medium text-foreground hover:bg-background/90">
          {certificate.certificateId}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Course
          </p>

          <p className="mt-1 font-semibold text-foreground">
            {certificate.courseTitle}
          </p>

          {organizationName ? (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{organizationName}</span>
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            {user?.avatar?.url ? (
              <AvatarImage src={user.avatar.url} alt={studentName} />
            ) : null}

            <AvatarFallback className="text-xs">
              {getInitials(studentName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {studentName}
            </p>

            <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
              <Mail className="h-3 w-3 shrink-0" />
              {user?.email}
            </p>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3 border-t border-border pt-3">
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Learning hours
            </p>

            <p className="mt-1 text-base font-semibold text-foreground">
              {learningHours}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                hrs
              </span>
            </p>
          </div>

          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              Issued
            </p>

            <p className="mt-1 text-sm font-semibold text-foreground">
              {formatDate(certificate.issuedAt)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
