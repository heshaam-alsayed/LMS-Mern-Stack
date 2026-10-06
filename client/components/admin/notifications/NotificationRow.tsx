"use client";

import { Bell, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { INotification } from "@/types/notification.type";

type Props = {
  notification: INotification;
  isMarking: boolean;
  onMarkAsRead: (id: string) => void;
};

export default function NotificationRow({
  notification,
  isMarking,
  onMarkAsRead,
}: Props) {
  const isUnread = notification.status === "unread";

  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-background p-3 sm:p-5">
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

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <p className="min-w-0 font-semibold text-foreground">
            {notification.title}
          </p>

          <div className="flex shrink-0 items-center gap-2">
            <Badge variant={isUnread ? "default" : "secondary"}>
              {isUnread ? "Unread" : "Read"}
            </Badge>

            {isUnread ? (
              <button
                type="button"
                onClick={() => onMarkAsRead(notification._id)}
                disabled={isMarking}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-60">
                <Check className={`h-3 w-3 ${isMarking ? "animate-spin" : ""}`} />

                Mark as read
              </button>
            ) : null}
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
}
