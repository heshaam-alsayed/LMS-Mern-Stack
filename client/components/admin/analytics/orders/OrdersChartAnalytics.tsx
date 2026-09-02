"use client";

import { BarChart3, ShoppingCart } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { IChartAnalyticsOrders } from "@/types/order.type";

const chartConfig = {
  count: {
    label: "Orders",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

type Props = {
  chartData: IChartAnalyticsOrders[];
  year: string;
};

export function OrdersChartMonthly({ chartData, year }: Props) {
  const totalOrders = chartData.reduce((total, item) => total + item.count, 0);

  const isEmpty = chartData.length === 0 || totalOrders === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Activity Overview</CardTitle>

        <CardDescription>Orders placed each month in {year}.</CardDescription>
      </CardHeader>

      <CardContent>
        {isEmpty ? (
          /* Empty State */
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-foreground">
              No order data available
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
              No orders were placed in {year}. Order activity will appear here
              once customers start purchasing courses.
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
                right: 10,
                left: 10,
                bottom: 0,
              }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tickFormatter={(value) => value.slice(0, 3)}
              />

              {/* Y Axis - Order Count */}
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={50}
                label={{
                  value: "Orders",
                  angle: -90,
                  position: "insideLeft",
                  offset: 0,
                  style: {
                    textAnchor: "middle",
                    fill: "currentColor",
                    fontSize: 12,
                  },
                }}
              />

              <ChartTooltip
                cursor={{
                  fill: "var(--muted)",
                  opacity: 0.35,
                }}
                content={
                  <ChartTooltipContent
                    className="
                      min-w-[180px]
                      rounded-xl
                      border-border
                      bg-popover
                      p-0
                      shadow-lg
                    "
                    hideIndicator
                    labelFormatter={(label) => {
                      return (
                        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                          <div
                            className="
                              flex h-9 w-9 shrink-0
                              items-center justify-center
                              rounded-lg
                              bg-primary/10
                              text-primary
                            ">
                            <ShoppingCart className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {label}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              Order activity
                            </p>
                          </div>
                        </div>
                      );
                    }}
                    formatter={(value) => {
                      const count = Number(value);

                      return (
                        <div className="flex w-full items-center justify-between gap-6 px-4 py-3">
                          <span className="text-xs text-muted-foreground">
                            Orders placed
                          </span>

                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-bold text-foreground">
                              {count.toLocaleString()}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              {count === 1 ? "order" : "orders"}
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                }
              />

              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[8, 8, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="border-t border-border pt-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShoppingCart className="h-4 w-4" />
          </div>

          <div>
            <p className="font-medium text-foreground">
              {totalOrders.toLocaleString()}{" "}
              {totalOrders === 1 ? "order" : "orders"} placed
            </p>

            <p className="text-xs text-muted-foreground">
              Total orders placed in {year}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
