"use client";

import { IAdminUserStatistics } from "@/types/operation.type";
import {
  BookOpen,
  CheckCircle2,
  CircleDollarSign,
  PlayCircle,
  TrendingUp,
} from "lucide-react";

interface UserStatisticsProps {
  statistics: IAdminUserStatistics;
}

export default function UserStatsOperation({
  statistics,
}: UserStatisticsProps) {
  const stats = [
    {
      title: "Total Courses",
      value: statistics.totalCourses,
      description: "Purchased courses",
      icon: BookOpen,
    },
    {
      title: "Completed Courses",
      value: statistics.completedCourses,
      description: "Successfully completed",
      icon: CheckCircle2,
    },
    {
      title: "Not Started",
      value: statistics.notStartedCourses,
      description: "Courses not started yet",
      icon: PlayCircle,
    },
    {
      title: "Total Spent",
      value: `$${statistics.totalSpent.toLocaleString()}`,
      description: "Total purchase amount",
      icon: CircleDollarSign,
    },
  ];

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
          <TrendingUp className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            User Statistics
          </h2>

          <p className="text-sm text-muted-foreground">
            Overview of the user&apos;s learning and purchase activity
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-300 group-hover:bg-primary/10" />

              <div className="relative flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="relative mt-5">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </p>

                <p className="mt-1.5 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </div>
          );
        })}
      </div>
    </section>
  );
}