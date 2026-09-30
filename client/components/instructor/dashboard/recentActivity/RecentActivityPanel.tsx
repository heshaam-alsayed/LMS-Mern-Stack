"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

import RecentActivityTopSelect from "./RecentActivityTopSelect";
import RecentActivityPanelSkeleton from "./RecentActivityPanelSkeleton";
import RecentActivityEmptyState from "./RecentActivityEmptyState";
import RecentActivityErrorState from "./RecentActivityErrorState";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;

  count: number;
  isEmpty: boolean;
  emptyMessage: string;

  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry: () => void;

  top: string;
  onTopChange: (value: string) => void;

  children: ReactNode;
};

export default function RecentActivityPanel({
  icon: Icon,
  title,
  description,
  count,
  isEmpty,
  emptyMessage,
  isLoading,
  isError,
  error,
  onRetry,
  top,
  onTopChange,
  children,
}: Props) {
  if (isLoading) {
    return <RecentActivityPanelSkeleton />;
  }

  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm">
      <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-6 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>

          <p className="truncate text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        {!isEmpty && !isError ? (
          <span className="shrink-0 rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            {count}
          </span>
        ) : null}

        <RecentActivityTopSelect
          value={top}
          onValueChange={onTopChange}
          ariaLabel={`Number of ${title.toLowerCase()} to show`}
        />
      </div>

      {isError ? (
        <RecentActivityErrorState
          title={`Could not load ${title.toLowerCase()}`}
          message={error?.message}
          onRetry={onRetry}
        />
      ) : isEmpty ? (
        <RecentActivityEmptyState message={emptyMessage} />
      ) : (
        children
      )}
    </div>
  );
}
