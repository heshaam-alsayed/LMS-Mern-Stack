"use client";

import { AlertCircle, CalendarDays, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import OrdersRevenueSkeleton from "@/components/skeleton/OrdersRevenueSkeleton";

import { IRevenueOrdersMonthly } from "@/types/order.type";

type Props = {
  year: string;
  monthlyData: IRevenueOrdersMonthly[] | undefined;

  yearlyRevenue: number | undefined;
  allTimeRevenue: number | undefined;

  isError: boolean;
  isLoading: boolean;

  years: number[];
  handleYearChange: (year: string) => void;

  error?: string | null;
};

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function OrdersRevenueChart({
  year,
  monthlyData,
  yearlyRevenue,
  allTimeRevenue,
  isError,
  isLoading,
  years,
  handleYearChange,
  error,
}: Props) {
  const isEmpty =
    monthlyData?.length === 0 || monthlyData?.every((item) => item.revenue === 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:items-center">
          {/* Title */}
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg">
              Revenue Overview
            </CardTitle>

            <CardDescription className="mt-1 text-xs sm:text-sm">
              Monthly course revenue for {year}.
            </CardDescription>
          </div>

          {/* Revenue Summary */}
          <div className="flex items-center justify-start gap-5 sm:justify-center lg:gap-6">
            {isLoading ? (
              <>
                <div className="flex flex-col items-center">
                  <div className="h-6 w-20 animate-pulse rounded-md bg-muted" />
                  <div className="mt-1.5 h-2.5 w-16 animate-pulse rounded-md bg-muted" />
                </div>

                <div className="h-8 w-px bg-border" />

                <div className="flex flex-col items-center">
                  <div className="h-6 w-20 animate-pulse rounded-md bg-muted" />
                  <div className="mt-1.5 h-2.5 w-16 animate-pulse rounded-md bg-muted" />
                </div>
              </>
            ) : (
              <>
                {/* Year Revenue */}
                <div className="min-w-0 text-center">
                  <p className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    ${yearlyRevenue?.toLocaleString()}
                  </p>

                  <p className="mt-0.5 whitespace-nowrap text-[10px] font-medium text-muted-foreground sm:text-xs">
                    {year} Revenue
                  </p>
                </div>

                <div className="h-8 w-px shrink-0 bg-border" />

                {/* All Time Revenue */}
                <div className="min-w-0 text-center">
                  <p className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    ${allTimeRevenue?.toLocaleString()}
                  </p>

                  <p className="mt-0.5 whitespace-nowrap text-[10px] font-medium text-muted-foreground sm:text-xs">
                    All Time Revenue
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Year Select */}
          <div className="flex w-full justify-start sm:col-span-2 lg:col-span-1 lg:justify-end">
            <Select
              value={year}
              onValueChange={handleYearChange}
              disabled={isLoading}>
              <SelectTrigger className="h-9 w-full text-xs sm:w-[120px]">
                <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />

                <SelectValue placeholder="Select year" />
              </SelectTrigger>

              <SelectContent>
                {years.map((item) => (
                  <SelectItem key={item} value={String(item)}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Loading */}
        {isLoading ? (
          <OrdersRevenueSkeleton />
        ) : isError ? (
          /* Error */
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-destructive/30 bg-destructive/5 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-foreground">
              Failed to load revenue data
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
              {error || "Something went wrong while fetching revenue data."}
            </p>
          </div>
        ) : isEmpty ? (
          /* Empty */
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-foreground">
              No revenue data available
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
              No course revenue was generated in {year}. Revenue activity will
              appear here once customers purchase courses.
            </p>
          </div>
        ) : (
          /* Chart */
          <ChartContainer config={chartConfig} className="h-[320px] w-full">
            <AreaChart accessibilityLayer data={monthlyData}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={14}
                tickFormatter={(value) => value.slice(0, 3)}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={50}
                tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
              />

              <ChartTooltip
                cursor={{
                  stroke: "var(--border)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) {
                    return null;
                  }

                  const data = payload[0]?.payload as
                    | IRevenueOrdersMonthly
                    | undefined;

                  if (!data) {
                    return null;
                  }

                  return (
                    <div className="min-w-[220px] overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
                      {/* Header */}
                      <div className="border-b border-border px-4 py-3">
                        <p className="text-sm font-semibold text-foreground">
                          {data.month}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Monthly revenue overview
                        </p>
                      </div>

                      {/* Content */}
                      <div className="space-y-2 p-3">
                        {/* Orders */}
                        <div className="flex items-center justify-between rounded-lg px-2 py-2">
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />

                            <span className="text-xs text-muted-foreground">
                              Orders
                            </span>
                          </div>

                          <span className="text-sm font-semibold text-foreground">
                            {Number(data.orders).toLocaleString()}
                          </span>
                        </div>

                        {/* Revenue */}
                        <div className="flex items-center justify-between rounded-lg bg-primary/5 px-2 py-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor: "var(--color-revenue)",
                              }}
                            />

                            <span className="text-xs text-muted-foreground">
                              Revenue
                            </span>
                          </div>

                          <span className="text-sm font-bold text-foreground">
                            ${Number(data.revenue).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              <Area
                dataKey="revenue"
                type="linear"
                fill="var(--color-revenue)"
                fillOpacity={0.25}
                stroke="var(--color-revenue)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
