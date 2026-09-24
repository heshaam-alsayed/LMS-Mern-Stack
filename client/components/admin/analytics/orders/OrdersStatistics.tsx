"use client";

import {
  CircleDollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

type OrdersStatisticsProps = {
  totalOrders: number;
  newOrders: number;
  totalRevenue: number;
  yearlyRevenue: number;
};

export default function OrdersStatistics({
  totalOrders,
  newOrders,
  totalRevenue,
  yearlyRevenue,
}: OrdersStatisticsProps) {
  const statistics = [
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      description: "All orders placed since the platform started",
      icon: ShoppingCart,
    },
    {
      title: "New Orders",
      value: newOrders.toLocaleString(),
      description: "Orders placed during the selected year",
      icon: TrendingUp,
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      description: "Total revenue generated from all orders",
      icon: CircleDollarSign,
    },
    {
      title: "Yearly Revenue",
      value: `$${yearlyRevenue.toLocaleString()}`,
      description: "Revenue generated during the selected year",
      icon: CircleDollarSign,
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
              {/* Icon */}
              <div
                className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-lg
                  bg-primary/10
                  text-primary
                ">
                <Icon className="h-5 w-5" />
              </div>

              {/* Value */}
              <p className="min-w-0 truncate text-2xl font-bold tracking-tight text-card-foreground">
                {stat.value}
              </p>
            </div>

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
