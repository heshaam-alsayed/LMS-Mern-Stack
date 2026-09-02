import React from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function GrowthCardSkeleton() {
  return (
    <Card>
      {" "}
      <CardContent className="p-4">
        {" "}
        <div className="flex items-start justify-between gap-3">
          {" "}
          <div className="space-y-3">
            {" "}
            <Skeleton className="h-8 w-28" />{" "}
            <Skeleton className="h-3 w-36" />{" "}
          </div>{" "}
          <Skeleton className="h-14 w-14 rounded-full" />{" "}
        </div>{" "}
        <div className="mt-4 flex justify-between border-t border-border pt-3">
          {" "}
          <div className="space-y-2">
            {" "}
            <Skeleton className="h-5 w-12" />{" "}
            <Skeleton className="h-3 w-20" />{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            <Skeleton className="ml-auto h-5 w-12" />{" "}
            <Skeleton className="h-3 w-20" />{" "}
          </div>{" "}
        </div>{" "}
        <Skeleton className="mt-3 h-3 w-40" />{" "}
      </CardContent>{" "}
    </Card>
  );
}
