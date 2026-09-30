"use client";

import {
  Award,
  BookOpen,
  Clock,
  ShoppingCart,
  Users,
} from "lucide-react";

import { OrganizationDashboardStatistics } from "@/types/organization.type";

type InstructorDashboardStatsProps = {
  statistics: OrganizationDashboardStatistics;
};

export default function InstructorDashboardStats({
  statistics,
}: InstructorDashboardStatsProps) {
  const cards = [
    {
      title: "Total Students",
      value: (statistics.totalStudents ?? 0).toLocaleString(),
      description: "Unique enrolled students",
      icon: Users,
    },
    {
      title: "Total Courses",
      value: (statistics.totalCourses ?? 0).toLocaleString(),
      description: "Courses in your organization",
      icon: BookOpen,
    },
    {
      title: "Total Orders",
      value: (statistics.totalOrders ?? 0).toLocaleString(),
      description: "Course purchases made",
      icon: ShoppingCart,
    },
    {
      title: "Certificates",
      value: (statistics.totalCertificates ?? 0).toLocaleString(),
      description: "Certificates issued",
      icon: Award,
    },
    {
      title: "Learning Hours",
      value: `${(statistics.totalLearningHours ?? 0).toLocaleString()} h`,
      description: "Hours taught to students",
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              rounded-xl
              border border-border
              bg-card
              p-5
              transition-colors
              hover:bg-accent/50
            ">
            <div className="flex items-center justify-between">
              <div
                className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-lg
                  bg-primary/10
                  text-primary
                ">
                <Icon className="h-5 w-5" />
              </div>

              <p className="min-w-0 truncate text-2xl font-bold tracking-tight text-card-foreground">
                {card.value}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-card-foreground">
                {card.title}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
