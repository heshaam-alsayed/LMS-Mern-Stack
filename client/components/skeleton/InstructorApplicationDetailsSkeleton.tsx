import React from "react";

export default function InstructorApplicationDetailsSkeleton() {
  return (
    <main className="space-y-6 p-4">
      <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
          <div className="h-72 animate-pulse rounded-xl bg-muted" />
        </div>

        <div className="space-y-5">
          <div className="h-72 animate-pulse rounded-xl bg-muted" />
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </main>
  );
}
