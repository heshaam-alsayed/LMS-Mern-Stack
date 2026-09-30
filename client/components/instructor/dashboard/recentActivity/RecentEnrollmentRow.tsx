"use client";

import { GraduationCap } from "lucide-react";

import { timeAgo } from "@/lib/utils";

import { RecentEnrollment } from "@/types/organization.type";

import RecentActivityUserAvatar from "./RecentActivityUserAvatar";

type Props = {
  enrollment: RecentEnrollment;
};

export default function RecentEnrollmentRow({ enrollment }: Props) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/40">
      <RecentActivityUserAvatar user={enrollment.user} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {enrollment.user.name}
        </p>

        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <GraduationCap className="h-3 w-3 shrink-0" />

          <span className="truncate">{enrollment.course.name}</span>
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-foreground">
          ${enrollment.price.toLocaleString()}
        </p>

        <p className="text-xs text-muted-foreground">
          {timeAgo(enrollment.createdAt)}
        </p>
      </div>
    </div>
  );
}
