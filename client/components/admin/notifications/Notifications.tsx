"use client";

import Pagination from "@/components/shared/Pagination";
import NotificationsListSkeleton from "@/components/skeleton/NotificationsListSkeleton";

import useAdminNotifications from "@/hooks/admin/useAdminNotifications";
import useMarkNotificationAsRead from "@/hooks/admin/useMarkNotificationAsRead";

import NotificationRow from "./NotificationRow";
import NotificationsEmptyState from "./NotificationsEmptyState";
import NotificationsErrorState from "./NotificationsErrorState";
import NotificationsHeader from "./NotificationsHeader";

export default function Notifications() {
  const {
    notifications,
    pagination,
    isLoading,
    isError,
    error,
    refetch,
    status,
    limit,
    updateQuery,
    handleNext,
    handlePrevious,
  } = useAdminNotifications();

  const { markAsRead, isMarking } = useMarkNotificationAsRead();

  return (
    <div className="w-full">
      <NotificationsHeader
        total={pagination?.total ?? 0}
        status={status}
        limit={limit}
        onChange={updateQuery}
      />

      {isLoading ? <NotificationsListSkeleton /> : null}

      {!isLoading && isError ? (
        <NotificationsErrorState
          message={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      ) : null}

      {!isLoading && !isError && notifications.length === 0 ? (
        <NotificationsEmptyState />
      ) : null}

      {!isLoading && !isError && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationRow
              key={notification._id}
              notification={notification}
              isMarking={isMarking(notification._id)}
              onMarkAsRead={markAsRead}
            />
          ))}
        </div>
      ) : null}

      {(pagination?.totalPages ?? 0) > 1 ? (
        <div className="mt-4 w-full rounded-xl border border-border bg-background">
          <Pagination
            pagination={pagination}
            onNext={handleNext}
            onPrevious={handlePrevious}
            itemLabel="notifications"
          />
        </div>
      ) : null}
    </div>
  );
}
