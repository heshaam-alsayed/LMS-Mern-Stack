import { Suspense } from "react";

import Header from "@/components/shared/Header";
import { Skeleton } from "@/components/ui/skeleton";
import UserSupportTickets from "@/components/user/support/UserSupportTickets";

function UserSupportTicketsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-40 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export default function UserSupportPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <Suspense fallback={<UserSupportTicketsSkeleton />}>
          <UserSupportTickets />
        </Suspense>
      </main>
    </div>
  );
}