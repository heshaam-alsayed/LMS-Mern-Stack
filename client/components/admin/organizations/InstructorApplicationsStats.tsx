import { CheckCircle2, Clock3, Users, XCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { InstructorApplication } from "@/types/instructorApplication.type";

type Props = {
  applications: InstructorApplication[];
  totalApplications: number;
};

export default function InstructorApplicationsStats({
  applications,
  totalApplications,
}: Props) {
  const pending = applications.filter(
    (application) => application.status === "pending",
  ).length;

  const approved = applications.filter(
    (application) => application.status === "approved",
  ).length;

  const rejected = applications.filter(
    (application) => application.status === "rejected",
  ).length;

  const stats = [
    {
      label: "Total Applications",
      value: totalApplications,
      description: "All submitted applications",
      icon: Users,
      iconClassName: "bg-primary/10 text-primary",
    },
    {
      label: "Pending Review",
      value: pending,
      description: "Applications on this page",
      icon: Clock3,
      iconClassName: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Approved",
      value: approved,
      description: "Applications on this page",
      icon: CheckCircle2,
      iconClassName: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Rejected",
      value: rejected,
      description: "Applications on this page",
      icon: XCircle,
      iconClassName: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label} className="border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div
                  className={`flex size-10 items-center justify-center rounded-xl ${stat.iconClassName}`}>
                  <Icon className="size-5" />
                </div>
                <p className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </p>
              </div>

              <div className="mt-4">
                <p className="mt-1 text-sm font-medium">{stat.label}</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
