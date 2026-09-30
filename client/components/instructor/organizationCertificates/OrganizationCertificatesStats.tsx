"use client";

import { Award, Clock, GraduationCap, Users } from "lucide-react";

const TILES = [
  {
    key: "totalCertificates" as const,
    label: "Total Certificates",
    icon: Award,
  },
  {
    key: "totalStudents" as const,
    label: "Certified Students",
    icon: Users,
  },
  {
    key: "totalCourses" as const,
    label: "Courses Certified",
    icon: GraduationCap,
  },
  {
    key: "totalLearningHours" as const,
    label: "Learning Hours",
    icon: Clock,
  },
];

interface OrganizationCertificatesStatsProps {
  stats: {
    totalCertificates: number;
    totalStudents: number;
    totalCourses: number;
    totalLearningHours: number;
  };
}

export default function OrganizationCertificatesStats({
  stats,
}: OrganizationCertificatesStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {TILES.map((tile) => {
        const Icon = tile.icon;

        return (
          <div
            key={tile.key}
            className="rounded-xl border border-border bg-background px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Icon className="h-3.5 w-3.5 text-primary" />
              {tile.label}
            </div>

            <p className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">
              {(stats[tile.key] ?? 0).toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
