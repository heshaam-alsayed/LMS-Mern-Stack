// orderDetails/OrderStudentSection.tsx

"use client";

import { Mail, Phone } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import { OrganizationOrderCustomer } from "@/types/organization.type";

type Props = {
  user: OrganizationOrderCustomer;
};

export function OrderStudentSection({ user }: Props) {
  const initials =
    user.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?";

  return (
    <section>
      {/* Header */}
      <div className="mb-5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Customer
        </p>

        <h3 className="mt-1 text-base font-semibold text-foreground">
          Student Information
        </h3>
      </div>

      {/* Student */}
      <div className="flex items-center gap-3.5">
        <Avatar className="h-12 w-12 shrink-0 border border-border/60">
          {user.avatar?.url ? (
            <AvatarImage src={user.avatar.url} alt={user.name || "Student"} />
          ) : null}

          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="truncate text-sm font-semibold text-foreground sm:text-base">
              {user.name || "—"}
            </h4>

            {user.status && (
              <Badge
                variant="outline"
                className="rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize">
                {user.status}
              </Badge>
            )}
          </div>

          <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5 shrink-0" />

            <span className="truncate">{user.email || "—"}</span>
          </div>
        </div>
      </div>

      {/* Student Details */}
      <div className="mt-6 grid grid-cols-1 border-y border-border/60 sm:grid-cols-2">
        {/* Email */}
        <div className="flex items-center gap-3 py-4 sm:border-r sm:border-border/60 sm:pr-5">
          <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />

          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Email
            </p>

            <p className="mt-1 truncate text-xs font-medium text-foreground">
              {user.email || "—"}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 border-t border-border/60 py-4 sm:border-t-0 sm:pl-5">
          <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />

          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Phone
            </p>

            <p className="mt-1 truncate text-xs font-medium text-foreground">
              {user.phone || "—"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
