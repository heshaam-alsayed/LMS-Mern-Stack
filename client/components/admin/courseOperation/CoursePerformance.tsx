"use client";

import {
  CircleDollarSign,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ICourseDetails, ICourseOrder, ICourseStatistics } from "@/types/operation.type";

interface CoursePerformanceProps {
  course: ICourseDetails | undefined;
  statistics: ICourseStatistics | undefined;
  orders: ICourseOrder[] | undefined;
}

export default function CoursePerformance({
  course,
  statistics,
  orders,
}: CoursePerformanceProps) {
  if (!course || !statistics) return null;

  const totalOrders = orders?.length ?? 0;

  const totalStudents = statistics.totalStudents ?? 0;

  const totalRevenue = statistics.totalRevenue ?? 0;

  const rating = course.ratings ?? 0;

  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toLocaleString(),
      description: "Students enrolled",
      icon: Users,
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      description: "Revenue generated",
      icon: CircleDollarSign,
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      description: "Successful purchases",
      icon: ShoppingCart,
    },
    {
      title: "Average Rating",
      value: rating.toFixed(1),
      description: "Course rating",
      icon: Star,
    },
  ];

  return (
    <section className="mt-6">
      {/* ==================== Section Header ==================== */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Course Performance
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your course performance and sales.
        </p>
      </div>

      {/* ==================== Performance Cards ==================== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="border-border/60 bg-card shadow-sm transition-colors hover:bg-muted/30"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Content */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>

                    <p className="mt-2 truncate text-2xl font-bold tracking-tight text-foreground">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>

                  {/* Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/50">
                    <Icon className="h-4.5 w-4.5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}