import { Suspense } from "react";

import AdminTicketDetails from "@/components/admin/support/AdminTicketDetails";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  params: Promise<{ ticketId: string }>;
};

function AdminTicketDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-16 w-full max-w-md rounded-2xl" />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Skeleton className="h-72 w-full rounded-2xl" />

        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default async function AdminSupportTicketDetailsPage({ params }: Props) {
  const { ticketId } = await params;

  return (
    <Suspense fallback={<AdminTicketDetailsSkeleton />}>
      <AdminTicketDetails ticketId={ticketId} />
    </Suspense>
  );
}