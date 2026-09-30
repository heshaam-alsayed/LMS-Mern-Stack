"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import { BarChart3, ShoppingCart } from "lucide-react";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { CourseOrdersMonthly } from "@/types/organization.type";

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--primary)",
  },
  revenue: {
    label: "Revenue",
    color: "#10b981",
  },
} satisfies ChartConfig;

type Props = {
  monthly: CourseOrdersMonthly[];
  courseName: string;
  totalOrders: number;
  totalRevenue: number;
};

export default function CourseOrdersAnalyticsChart({
  monthly,
  courseName,
  totalOrders,
  totalRevenue,
}: Props) {
  const isEmpty = totalOrders === 0;

  if (isEmpty) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BarChart3 className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-foreground">
          No sales in the last 12 months
        </h3>

        <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
          {courseName} has no orders in this period yet. Once students start
          enrolling, the monthly trend shows up here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShoppingCart className="h-3.5 w-3.5 text-primary" />
            Orders
          </div>

          <p className="mt-1 text-xl font-bold tracking-tight text-foreground">
            {totalOrders.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-[#10b981]" />
            Revenue
          </div>

          <p className="mt-1 text-xl font-bold tracking-tight text-foreground">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-[280px] w-full">
        <ComposedChart
          accessibilityLayer
          data={monthly}
          margin={{
            top: 20,
            right: 10,
            left: 0,
            bottom: 0,
          }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />

          <XAxis
            dataKey="monthName"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            interval="preserveStartEnd"
          />

          <YAxis
            yAxisId="orders"
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={40}
          />

          <YAxis
            yAxisId="revenue"
            orientation="right"
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(value) => `$${value}`}
          />

          <ChartTooltip
            cursor={{ fill: "var(--muted)", opacity: 0.35 }}
            content={
              <ChartTooltipContent
                className="min-w-[180px] rounded-xl border-border bg-popover p-0 shadow-lg"
                hideIndicator
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload as
                    | CourseOrdersMonthly
                    | undefined;

                  if (!item) {
                    return <p className="font-semibold">{label}</p>;
                  }

                  return (
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-sm font-semibold text-foreground">
                        {label} {item.year}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Monthly course performance
                      </p>
                    </div>
                  );
                }}
                formatter={(value, name) => {
                  const numeric = Number(value);

                  const isRevenue = name === "revenue";

                  return (
                    <div className="flex w-full items-center justify-between gap-6 px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {isRevenue ? "Revenue" : "Orders placed"}
                      </span>

                      <span className="text-xl font-bold text-foreground">
                        {isRevenue
                          ? `$${numeric.toLocaleString()}`
                          : numeric.toLocaleString()}
                      </span>
                    </div>
                  );
                }}
              />
            }
          />

          <Bar
            yAxisId="orders"
            dataKey="orders"
            fill="var(--color-orders)"
            radius={[8, 8, 0, 0]}
            maxBarSize={32}
          />

          <Line
            yAxisId="revenue"
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-revenue)"
            strokeWidth={2}
            dot={{ r: 2.5, fill: "var(--color-revenue)" }}
            activeDot={{ r: 4 }}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
