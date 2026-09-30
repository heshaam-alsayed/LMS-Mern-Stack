import React from "react";

export default function CategoriesSidebarSkeleton() {
  return (
    <div className="space-y-5 p-5">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="size-8 animate-pulse rounded-lg bg-muted" />

        <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
      </div>

      {/* Categories */}
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex h-10 items-center justify-between rounded-lg px-3"
          >
            <div className="h-4 w-[65%] animate-pulse rounded-md bg-muted" />

            <div className="h-4 w-7 animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}