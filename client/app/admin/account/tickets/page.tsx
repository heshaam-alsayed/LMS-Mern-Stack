import { Suspense } from "react";

import AssignedTickets from "@/components/admin/account/tickets/AssignedTickets";
import { Skeleton } from "@/components/ui/skeleton";

function AssignedTicketsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-44 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export default function AdminAccountTicketsPage() {
  return (
    <Suspense fallback={<AssignedTicketsSkeleton />}>
      <AssignedTickets />
    </Suspense>
  );
}