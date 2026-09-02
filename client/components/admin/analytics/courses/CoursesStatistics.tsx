"use client";

import { BookOpen, GraduationCap, ShoppingCart, Star } from "lucide-react";

type CoursesStatisticsProps = {
  totalCourses: number;
  coursesCreated: number;
  totalPurchases: number;
  averageRating: number;
};

export default function CoursesStatistics({
  totalCourses,
  coursesCreated,
  totalPurchases,
  averageRating,
}: CoursesStatisticsProps) {
  const statistics = [
    {
      title: "Total Courses",
      value: totalCourses,
      description: "All available courses",
      icon: BookOpen,
    },
    {
      title: "Courses Created",
      value: coursesCreated,
      description: "Created this year",
      icon: GraduationCap,
    },
    {
      title: "Total Purchases",
      value: totalPurchases,
      description: "Across all courses",
      icon: ShoppingCart,
    },
    {
      title: "Average Rating",
      value: averageRating.toFixed(1),
      description: "Average course rating",
      icon: Star,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statistics.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              rounded-xl
              border border-border
              bg-card
              p-5
              transition-colors
              hover:bg-accent/50
            ">
            {/* Top Row */}
            <div className="flex items-center justify-between">
              {/* Icon - Start */}
              <div
                className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-lg
                  bg-primary/10
                  text-primary
                ">
                <Icon className="h-5 w-5" />
              </div>

              {/* Count - End */}
              <p className="text-2xl font-bold tracking-tight text-card-foreground">
                {stat.value}
              </p>
            </div>

            {/* Content */}
            <div className="mt-5">
              <p className="text-sm font-medium text-card-foreground">
                {stat.title}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
