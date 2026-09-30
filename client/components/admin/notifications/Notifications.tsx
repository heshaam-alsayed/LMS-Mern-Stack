"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Bell, BellOff, Check, RefreshCw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getAllNotifications } from "@/lib/api/getAllNotifications";
import { updateStatusNotification } from "@/lib/api/updateStatusNotification";
import { timeAgo } from "@/lib/utils";
import { toast } from "sonner";

import NotificationsListSkeleton from "@/components/skeleton/NotificationsListSkeleton";
import Pagination from "@/components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Notifications() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.toString();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-notifications", query],
    queryFn: () => getAllNotifications(query),
    staleTime: 5 * 60 * 1000,
  });

  const pagination = data?.pagination;
  const notifications = data?.notifications ?? [];

  const markAsReadMutation = useMutation({
    mutationFn: updateStatusNotification,
    onSuccess: () => {
      refetch();
      toast.success("Notification marked as read");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update notification",
      );
    },
  });

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key !== "page") {
      params.delete("page");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleNext = () => {
    if (!pagination?.hasNextPage) return;

    updateQuery("page", String(pagination.currentPage + 1));
  };

  const handlePrevious = () => {
    if (!pagination?.hasPreviousPage) return;

    updateQuery("page", String(pagination.currentPage - 1));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-3 sm:p-4">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Notifications Data
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              View all system notifications and manage their status.
            </p>
          </div>

          {/* Filters */}
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            {/* Status */}
            <div className="w-full sm:w-[190px]">
              <label className="mb-2 block text-xs font-medium text-foreground">
                Status
              </label>

              <Select
                value={searchParams.get("status") || "all"}
                onValueChange={(value) => updateQuery("status", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All</SelectItem>

                  <SelectItem value="unread">Unread</SelectItem>

                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Limit */}
            <div className="w-full sm:w-[130px]">
              <label className="mb-2 block text-xs font-medium text-foreground">
                Show
              </label>

              <Select
                value={searchParams.get("limit") || String(pagination?.limit ?? 10)}
                onValueChange={(value) => updateQuery("limit", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Show" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="5">5</SelectItem>

                  <SelectItem value="10">10</SelectItem>

                  <SelectItem value="15">15</SelectItem>

                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && <NotificationsListSkeleton />}

      {/* Error */}
      {!isLoading && isError && (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-border bg-background px-4 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <BellOff className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-foreground">
            Failed to load notifications
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading notifications."}
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            className="mt-6">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && notifications.length === 0 && (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bell className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-foreground">
            No notifications found
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            There are no notifications to display. New notifications will
            appear here as soon as they are created.
          </p>
        </div>
      )}

      {/* List */}
      {!isLoading && !isError && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const isUnread = notification.status === "unread";

            return (
              <div
                key={notification._id}
                className="flex items-start gap-4 rounded-xl border border-border bg-background p-3 sm:p-5">
                {/* Icon */}
                <div
                  className={`
                    flex
                    h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-full
                    ${
                      isUnread
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }
                  `}>
                  {isUnread ? (
                    <Bell className="h-5 w-5" />
                  ) : (
                    <Check className="h-5 w-5" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <h3 className="min-w-0 break-words font-semibold text-foreground">
                      {notification.title}
                    </h3>

                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant={isUnread ? "default" : "secondary"}>
                        {isUnread ? "Unread" : "Read"}
                      </Badge>

                      {isUnread && (
                        <button
                          type="button"
                          onClick={() =>
                            markAsReadMutation.mutate(notification._id)
                          }
                          disabled={markAsReadMutation.isPending}
                          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-60">
                          <Check className="h-3 w-3" />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {notification.message}
                  </p>

                  <p
                    className="mt-2 text-xs text-muted-foreground/70"
                    title={new Date(notification.createdAt).toLocaleString()}>
                    {timeAgo(notification.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

{/* Pagination */}
      {(pagination?.totalPages ?? 0) > 1 && (
        <div className="mt-4 w-full rounded-xl border border-border bg-background">
          <Pagination
            pagination={pagination}
            onNext={handleNext}
            onPrevious={handlePrevious}
            itemLabel="notifications"
          />
        </div>
      )}
    </div>
  );
}