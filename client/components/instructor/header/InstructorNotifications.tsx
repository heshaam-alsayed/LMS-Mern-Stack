"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { socket } from "@/lib/socket";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllNotifications } from "@/lib/api/getAllNotifications";
import { addNotification, setData, updateStatus } from "@/redux/features/notifications/notificationsSlice";
import { updateStatusNotification } from "@/lib/api/updateStatusNotification";
import { INotification } from "@/types/notification.type";

export function InstructorNotifications() {
  const dispatch = useAppDispatch();

  const { data: notificationsData } = useAppSelector(
    (state) => state.notifications,
  );

  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["get-notifications"],
    queryFn: () => getAllNotifications(),
  });

  useEffect(() => {
    if (data) {
      dispatch(setData(data));
    }
  }, [data, dispatch]);

  const updateStatusMutation = useMutation({
    mutationKey: ["update-status"],
    mutationFn: (notificationId: string) =>
      updateStatusNotification(notificationId),

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleUpdateStatus = (id: string) => {
    dispatch(updateStatus(id));
    updateStatusMutation.mutate(id);
  };

  useEffect(() => {
    const handleNotification = (notification: INotification) => {
      dispatch(addNotification(notification));

      const audio = new Audio("/sounds/notification.mp3");

      audio.volume = 1;

      audio.play().catch(() => {});
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [dispatch]);

  const notifications = notificationsData?.notifications?.slice(0, 7) ?? [];

  const unreadCount =
    notificationsData?.notifications.filter(
      (notification) => notification.status === "unread",
    ).length ?? 0;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted">
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[360px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h3 className="font-semibold">Notifications</h3>

            <p className="text-xs text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} unread notifications`
                : "No unread notifications"}
            </p>
          </div>

          {unreadCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
              {unreadCount} new
            </span>
          )}
        </div>

        {/* Notifications */}
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications found.
            </div>
          ) : (
            notifications.map((notification) => {
              const isUnread = notification.status === "unread";

              return (
                <DropdownMenuItem
                  key={notification._id}
                  className="cursor-default p-0 focus:bg-transparent"
                  onSelect={(event) => event.preventDefault()}>
                  <div
                    className={`w-full border-b p-4 ${
                      isUnread ? "bg-primary/5" : ""
                    }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold">
                            {notification.title}
                          </p>

                          {isUnread && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>

                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>

                      {isUnread && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 shrink-0"
                          onClick={() => handleUpdateStatus(notification._id)}
                          disabled={updateStatusMutation.isPending}>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-2">
          <Link
            href="/instructor/notifications"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center rounded-md py-2 text-sm font-medium text-primary hover:bg-primary/10">
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
