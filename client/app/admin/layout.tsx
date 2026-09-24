"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { getAllNotifications } from "@/lib/api/getAllNotifications";
import { updateStatusNotification } from "@/lib/api/updateStatusNotification";

import {
  addNotification,
  setData,
  updateStatus,
} from "@/redux/features/notifications/notificationsSlice";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { useMutation, useQuery } from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Bell, Check, Circle, Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { socket } from "@/lib/socket";
import { INotification } from "@/types/notification.type";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const dispatch = useAppDispatch();

  const { data: notificationsData } = useAppSelector(
    (state) => state.notifications,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const { data, isLoading } = useQuery({
    queryKey: ["get-notifications"],
    queryFn: () => getAllNotifications(),
  });

  const updateStatusMutation = useMutation({
    mutationKey: ["update-status"],
    mutationFn: (notificationId: string) => {
      return updateStatusNotification(notificationId);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleUpdateStatus = (id: string) => {
    // Update Redux
    dispatch(updateStatus(id));

    // Update Backend
    updateStatusMutation.mutate(id);
  };

  useEffect(() => {
    if (data) {
      dispatch(setData(data));
    }
  }, [data, dispatch]);

  const notifications = notificationsData?.notifications?.slice(0, 7) ?? [];

  const hasUnreadNotifications = notifications.some(
    (notification) => notification.status === "unread",
  );
  const unreadCount =
    notificationsData?.notifications.filter(
      (notification) => notification.status === "unread",
    ).length ?? 0;
  useEffect(() => {
    const handleNotification = (notification: INotification) => {
      console.log(" SOCKET NOTIFICATION:", notification);

      dispatch(addNotification(notification));

      const audio = new Audio("/sounds/notification.mp3");

      audio.volume = 1;

      audio.play();
    };
    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
        collapsed={sidebarCollapsed}
        onCollapseChange={setSidebarCollapsed}
      />
      <div
        className={cn(
          "min-w-0 flex-1",
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]",
        )}>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden">
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={toggleTheme}
              disabled={!mounted}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              {mounted &&
                (theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                ))}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative bg-muted flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Bell className="h-5 w-5" />

                  {hasUnreadNotifications && (
                    <span className="absolute -right-2 -top-2 flex min-w-5 h-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="flex w-[calc(100vw-2rem)] max-w-full flex-col overflow-hidden p-0 md:w-110">
                <DropdownMenuLabel className="shrink-0 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />

                      <span className="text-sm font-semibold text-foreground">
                        Notifications
                      </span>
                    </div>

                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                      {notificationsData?.pagination.total ?? 0} total
                    </span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="m-0 shrink-0" />

                <div
                  className="
                    max-h-[360px]
                    overflow-y-auto
                    scrollbar-none
                    [&::-webkit-scrollbar]:hidden
                    [-ms-overflow-style:none]
                    [scrollbar-width:none]
                  ">
                  {isLoading && (
                    <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                      Loading notifications...
                    </div>
                  )}

                  {!isLoading && notifications.length === 0 && (
                    <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                      No notifications
                    </div>
                  )}

                  {!isLoading &&
                    notifications.length > 0 &&
                    notifications.map((notification) => {
                      const isUnread = notification.status === "unread";

                      return (
                        <DropdownMenuItem
                          key={notification._id}
                          onSelect={(event) => {
                            // Keep dropdown open
                            event.preventDefault();
                          }}
                          className={`
                            cursor-pointer
                            items-start
                            gap-3
                            rounded-none
                            border-b
                            border-border
                            px-4
                            py-3
                            outline-none
                            last:border-b-0
                            hover:bg-accent
                            ${isUnread ? "bg-primary/5" : "bg-background"}
                          `}>
                          <div
                            className={`
                              mt-0.5
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              ${
                                isUnread
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }
                            `}>
                            {isUnread ? (
                              <Bell className="h-4 w-4" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </div>

<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                            <div className="flex items-center justify-between gap-2">
                              <p
                                className={`
                                  line-clamp-1
                                  text-sm
                                  ${
                                    isUnread
                                      ? "font-semibold text-foreground"
                                      : "font-medium text-muted-foreground"
                                  }
                                `}>
                                {notification.title}
                              </p>

                              {isUnread && (
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();

                                    handleUpdateStatus(notification._id);
                                  }}
                                  className="
                                    inline-flex
                                    shrink-0
                                    items-center
                                    gap-1
                                    rounded-full
                                    bg-primary/10
                                    px-2
                                    py-0.5
                                    text-[10px]
                                    font-medium
                                    text-primary
                                    transition-colors
                                    hover:bg-primary/20
                                  ">
                                  <Check className="h-3 w-3" />
                                  Mark
                                </button>
                              )}
                            </div>

                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                              {notification.message}
                            </p>

                            <p className="mt-2 text-[11px] text-muted-foreground/70">
                              {new Date(
                                notification.createdAt,
                              ).toLocaleString()}
                            </p>

                            {!isUnread && (
                              <p className="mt-2 inline-flex w-20 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                <Check className="h-3 w-3" />
                                Read
                              </p>
                            )}
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                </div>

                {!isLoading && notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator className="m-0 shrink-0" />

                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/notifications"
                        className="shrink-0 cursor-pointer justify-center rounded-none py-3 text-sm font-medium text-primary outline-none hover:bg-accent hover:text-primary">
                        View all notifications
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-3 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
