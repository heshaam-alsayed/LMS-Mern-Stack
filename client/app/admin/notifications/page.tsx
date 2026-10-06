import { Suspense } from "react";

import Notifications from "@/components/admin/notifications/Notifications";
import NotificationsListSkeleton from "@/components/skeleton/NotificationsListSkeleton";

export default function NotificationsPage() {
  // the read filter lives in the query string
  return (
    <Suspense fallback={<NotificationsListSkeleton />}>
      <Notifications />
    </Suspense>
  );
}