"use client";

import GrowthCardSkeleton from "@/components/skeleton/GrowthCardSkeleton";
import { IGrowthItem } from "@/types/order.type";
import { AlertCircle } from "lucide-react";
import GrowthCard from "./GrowthCard";

type Props = {
  users?: IGrowthItem;
  courses?: IGrowthItem;
  orders?: IGrowthItem;
  isLoading: boolean;
  isError: boolean;
  error?: string | null;
};

export default function GrowthAnalyticsCards({
  users,
  courses,
  orders,
  isLoading,
  isError,
  error,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex h-full min-h-[300px] w-full flex-col gap-3">
        <div className="min-h-0 flex-1">
          <GrowthCardSkeleton />
        </div>

        <div className="min-h-0 flex-1">
          <GrowthCardSkeleton />
        </div>

        <div className="min-h-0 flex-1">
          <GrowthCardSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full min-h-[300px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-destructive/30 bg-destructive/5 px-4 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
        </div>

        <h3 className="mt-3 text-sm font-semibold text-foreground">
          Failed to load growth analytics
        </h3>

        <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
          {error || "Something went wrong while fetching analytics."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="min-h-0 ">
        <GrowthCard item={users} type="users" />
      </div>

      <div className="min-h-0 ">
        <GrowthCard item={courses} type="courses" />
      </div>

      <div className="min-h-0">
        <GrowthCard item={orders} type="orders" />
      </div>
    </div>
  );
}
