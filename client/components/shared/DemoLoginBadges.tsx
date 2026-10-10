"use client";

import { GraduationCap, ShieldCheck, User } from "lucide-react";

export const DEMO_PASSWORD = "Password123";

export const DEMO_ACCOUNTS = [
  {
    role: "User",
    email: "youssef.hassan@lms.test",
    password: DEMO_PASSWORD,
    icon: User,
    className:
      "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20",
  },
  {
    role: "Instructor",
    email: "omar.mahmoud@lms.test",
    password: DEMO_PASSWORD,
    icon: GraduationCap,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20",
  },
  {
    role: "Admin",
    email: "mostafa.ahmed@lms.test",
    password: DEMO_PASSWORD,
    icon: ShieldCheck,
    className:
      "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20",
  },
] as const;

interface Props {
  onSelect: (email: string, password: string) => void;
  disabled?: boolean;
}

export default function DemoLoginBadges({ onSelect, disabled }: Props) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-3">
      <p className="mb-2 text-center text-xs font-medium text-muted-foreground">
        Live demo — one-click login
      </p>

      <div className="grid grid-cols-3 gap-2">
        {DEMO_ACCOUNTS.map(({ role, email, password, icon: Icon, className }) => (
          <button
            key={role}
            type="button"
            disabled={disabled}
            title={`${email} / ${password}`}
            onClick={() => onSelect(email, password)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${className}`}>
            <Icon className="size-3.5 shrink-0" />
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}
