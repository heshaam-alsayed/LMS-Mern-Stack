
"use client";

import { TrendingUp, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
} from "recharts";

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
  type ChartConfig,
} from "@/components/ui/chart";

import { IChartAnalyticsUsers } from "@/types/user.type";

const chartConfig = {
  count: {
    label: "Users",
    color: "var(primary)",
  },
} satisfies ChartConfig;

type Props = {
  year: string;
  chartData: IChartAnalyticsUsers[];
};

export function UsersChartAnalytics({
  year,
  chartData,
}: Props) {
  const totalUsers = chartData.reduce(
    (total, item) => total + item.count,
    0
  );

  const isEmpty =
    chartData.length === 0 || totalUsers === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Analytics</CardTitle>

        <CardDescription>
          Monthly user registrations for {year}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isEmpty ? (
          <div className="flex h-[300px] w-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Users className="h-7 w-7 text-muted-foreground" />
            </div>

            <h3 className="text-sm font-semibold text-foreground">
              No users yet
            </h3>

            <p className="mt-1 max-w-sm px-4 text-sm text-muted-foreground">
              There are no registered users to display for{" "}
              {year}. User registration data will appear here
              once users join the platform.
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[300px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  value.slice(0, 3)
                }
              />

              <ChartTooltip
                cursor={{
                  fill: "var(--muted)",
                  opacity: 0.35,
                }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) {
                    return null;
                  }

                  const data = payload[0];

                  const month =
                    data.payload?.month ?? "";

                  const count = Number(
                    data.value ?? 0
                  );

                  return (
                    <div className="min-w-[180px] rounded-xl border bg-background p-3 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Users className="h-4 w-4 text-primary" />
                        </div>

                        <div className="flex min-w-0 flex-col">
                          <span className="text-xs font-medium text-muted-foreground">
                            {month}
                          </span>

                          <div className="mt-1 flex items-baseline gap-1.5">
                            <span className="text-lg font-bold leading-none text-foreground">
                              {count.toLocaleString()}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              users
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              <Bar
                dataKey="count"
                fill="var(--chart-2)"
                radius={[8, 8, 0, 0]}
              >
                <LabelList
                  dataKey="count"
                  position="top"
                  offset={10}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        {!isEmpty && (
          <>
            <div className="flex items-center gap-2 font-medium leading-none">
              User registrations are growing

              <TrendingUp className="h-4 w-4 text-primary" />
            </div>

            <div className="leading-none text-muted-foreground">
              Showing monthly registered users for {year}
            </div>
          </>
        )}

        {isEmpty && (
          <div className="leading-none text-muted-foreground">
            No registration activity for {year}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

