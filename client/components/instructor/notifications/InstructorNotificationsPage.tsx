"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { getAllNotifications } from "@/lib/api/getAllNotifications";
import { updateStatusNotification } from "@/lib/api/updateStatusNotification";
import { timeAgo } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAppDispatch } from "@/redux/hooks";
import { updateStatus } from "@/redux/features/notifications/notificationsSlice";

export default function InstructorNotificationsPage() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["get-notifications"],
    queryFn: () => getAllNotifications(),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["get-notifications"] });
  }, [queryClient]);

  const notifications = data?.notifications ?? [];

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => updateStatusNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-notifications"] });
    },
    onError: (mutationError) => {
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to update notification",
      );
    },
  });

  const handleMarkAsRead = (id: string) => {
    dispatch(updateStatus(id));
    markAsReadMutation.mutate(id);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Sales, reviews and questions on your courses.
          </p>
        </div>

        <div className="w-full sm:w-[190px]">
          <label className="mb-2 block text-xs font-medium text-foreground">
            Status
          </label>

          <Select value="all" disabled>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((key) => (
            <div
              key={key}
              className="h-24 animate-pulse rounded-xl bg-muted/60"
            />
          ))}
        </div>
      )}

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

      {!isLoading && !isError && notifications.length === 0 && (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bell className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-foreground">
            No notifications yet
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            You will be notified here when a student buys one of your courses,
            reviews it, or asks a question.
          </p>
        </div>
      )}

      {!isLoading && !isError && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const isUnread = notification.status === "unread";

            return (
              <div
                key={notification._id}
                className={`flex items-start gap-4 rounded-xl border border-border bg-background p-3 sm:p-5 ${
                  isUnread ? "border-primary/40 bg-primary/[0.03]" : ""
                }`}>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    isUnread
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                  {isUnread ? (
                    <Bell className="h-5 w-5" />
                  ) : (
                    <Check className="h-5 w-5" />
                  )}
                </div>

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
                          onClick={() => handleMarkAsRead(notification._id)}
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

      <div>
        <Button asChild variant="outline">
          <Link href="/instructor">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
