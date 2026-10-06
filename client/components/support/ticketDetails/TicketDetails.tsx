"use client";

import { Suspense } from "react";

import TicketDetailsContent from "./TicketDetailsContent";
import TicketDetailsSkeleton from "./TicketDetailsSkeleton";

type Props = {
  ticketId: string;
};

export default function TicketDetails({ ticketId }: Props) {
  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-background">
      <Suspense fallback={<TicketDetailsSkeleton />}>
        <TicketDetailsContent ticketId={ticketId} />
      </Suspense>
    </main>
  );
}