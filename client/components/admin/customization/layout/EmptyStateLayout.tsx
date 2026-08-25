import { Layers3, Plus } from "lucide-react";

type Props = {
  onOpen: () => void;
};

export default function EmptyStateLayout({ onOpen }: Props) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-border bg-muted/50 text-primary shadow-sm">
          <Layers3 className="size-8" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          No layouts yet
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          Create your first layout to customize the content and appearance of
          your platform.
        </p>

        <button
          type="button"
          onClick={onOpen}
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30">
          <Plus className="size-4" />
          Create Layout
        </button>
      </div>
    </div>
  );
}
