"use client";

import {
  UserRound,
  UserPlus,
  BookOpenCheck,
  UserRoundX,
} from "lucide-react";

type UsersStatisticsProps = {
  totalUsers: number;
  newUsers: number;
  usersWithCourses: number;
  deletedUsers: number;
};

export default function UsersStatistics({
  totalUsers,
  newUsers,
  usersWithCourses,
  deletedUsers,
}: UsersStatisticsProps) {
  const statistics = [
    {
      title: "Total Users",
      value: totalUsers,
      description: "All active users",
      icon: UserRound,
    },
    {
      title: "Users Created",
      value: newUsers,
      description: "Created in selected year",
      icon: UserPlus,
    },
    {
      title: "Users with Courses",
      value: usersWithCourses,
      description: "Users enrolled in courses",
      icon: BookOpenCheck,
    },
    {
      title: "Deleted Users",
      value: deletedUsers,
      description: "Deleted in selected year",
      icon: UserRoundX,
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
            "
          >
            {/* Top Row */}
            <div className="flex items-center justify-between">
              {/* Icon */}
              <div
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-lg
                  bg-primary/10
                  text-primary
                "
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Count */}
              <p
                className="
                  min-w-0
                  truncate
                  text-2xl
                  font-bold
                  tracking-tight
                  text-card-foreground
                "
              >
                {stat.value.toLocaleString()}
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