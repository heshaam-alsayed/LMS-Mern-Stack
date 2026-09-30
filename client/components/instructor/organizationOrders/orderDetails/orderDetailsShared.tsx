import { Star } from "lucide-react";

export const DASH = "—";

export const PAYMENT_STYLES: Record<string, string> = {
  succeeded:
    "rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium capitalize text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400",
  pending:
    "rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium capitalize text-amber-600 hover:bg-amber-500/10 dark:text-amber-400",
  processing:
    "rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium capitalize text-amber-600 hover:bg-amber-500/10 dark:text-amber-400",
  failed:
    "rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium capitalize text-rose-600 hover:bg-rose-500/10 dark:text-rose-400",
  refunded:
    "rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-medium capitalize text-slate-600 hover:bg-slate-500/10 dark:text-slate-400",
};

export const STATUS_STYLES: Record<string, string> = {
  published:
    "rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium capitalize text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400",
  draft:
    "rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-medium capitalize text-slate-600 hover:bg-slate-500/10 dark:text-slate-400",
  archived:
    "rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium capitalize text-amber-600 hover:bg-amber-500/10 dark:text-amber-400",
  active:
    "rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium capitalize text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400",
  pending:
    "rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium capitalize text-amber-600 hover:bg-amber-500/10 dark:text-amber-400",
  suspended:
    "rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium capitalize text-rose-600 hover:bg-rose-500/10 dark:text-rose-400",
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const formatDate = (value?: string) => {
  if (!value) {
    return DASH;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return DASH;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatCurrency = (value?: number) =>
  typeof value === "number" ? `$${value.toLocaleString()}` : DASH;

type DetailRowProps = {
  label: string;
  value?: string | number | React.ReactNode;
  mono?: boolean;
};

export function DetailRow({ label, value, mono }: DetailRowProps) {
  const empty =
    value === undefined || value === null || value === "" || value === false;

  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="shrink-0 text-xs font-medium text-muted-foreground">
        {label}
      </span>

      <span
        className={`flex min-w-0 items-center justify-end gap-1.5 break-words text-right text-sm font-medium ${
          empty ? "text-muted-foreground/60" : "text-foreground"
        } ${mono ? "font-mono text-xs" : ""}`}>
        {empty ? DASH : value}
      </span>
    </div>
  );
}

type SectionCardProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

export function SectionCard({ icon, title, children }: SectionCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/80 bg-card">
      <header className="flex items-center gap-2.5 border-b border-border/70 bg-muted/40 px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>

        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h3>
      </header>

      <div className="p-4">{children}</div>
    </section>
  );
}

type RatingProps = {
  value?: number;
};

export function Rating({ value }: RatingProps) {
  if (typeof value !== "number") {
    return <span className="text-muted-foreground/60">{DASH}</span>;
  }

  return (
    <>
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
      {value.toFixed(1)}
    </>
  );
}
