"use client";

import { BookOpen, BarChart3 } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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

import { IChartAnalyticsCourses } from "@/types/course.type";

const chartConfig = {
  count: {
    label: "Courses",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type Props = {
  chartData: IChartAnalyticsCourses[];
  year: string;
};

export function CoursesChartMonthly({ chartData, year }: Props) {
  const totalCourses = chartData.reduce((total, item) => total + item.count, 0);

  const isEmpty = chartData.length === 0 || totalCourses === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Creation Overview</CardTitle>

        <CardDescription>Courses created each month in {year}.</CardDescription>
      </CardHeader>

      <CardContent>
        {isEmpty ? (
          /* Empty State */
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-foreground">
              No course data available
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
              No courses were created in {year}. Course creation activity will
              appear here once courses are added.
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={true} />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tickFormatter={(value) => value.slice(0, 3)}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={40}
              />

              <ChartTooltip
                cursor={false}
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
                        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                          <div
                            className="
                              flex h-9 w-9 shrink-0 items-center justify-center
                              rounded-lg
                              bg-primary/10
                              text-primary
                            ">
                            <BookOpen className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {label}
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
                            Courses created
                          </span>

                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-bold text-foreground">
                              {count}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              {count === 1 ? "course" : "courses"}
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                }
              />

              <Line
                dataKey="count"
                type="linear"
                stroke="var(--color-count)"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "var(--color-count)",
                }}
                activeDot={{
                  r: 8,
                }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="border-t border-border pt-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4" />
          </div>

          <div>
            <p className="font-medium text-foreground">
              {totalCourses} {totalCourses === 1 ? "course" : "courses"} created
            </p>

            <p className="text-xs text-muted-foreground">
              Total courses created in {year}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
