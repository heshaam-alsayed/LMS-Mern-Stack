import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

import type { TicketStatus } from "@/types/ticket.type";

const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; className: string }
> = {
  open: {
    label: "Open",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  in_progress: {
    label: "In progress",
    className:
      "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  closed: {
    label: "Closed",
    className:
      "border-muted-foreground/30 bg-muted text-muted-foreground",
  },
};

type Props = {
  status: TicketStatus;
};

export default function TicketStatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.className,
      )}>
      <span className="size-1.5 rounded-full bg-current" />

      {config.label}
    </Badge>
  );
}