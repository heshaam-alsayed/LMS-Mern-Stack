import { Inbox } from "lucide-react";

type Props = {
  message: string;
};

export default function RecentActivityEmptyState({ message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-5 w-5 text-muted-foreground" />
      </div>

      <p className="text-sm font-medium text-foreground">Nothing here yet</p>

      <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
