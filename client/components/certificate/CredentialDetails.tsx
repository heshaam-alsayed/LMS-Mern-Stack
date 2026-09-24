"use client";

import { Award, Clock3, IdCard, UserRound } from "lucide-react";

type CredentialDetailsProps = {
  recipientName: string;
  issuedDate: string;
  credentialId: string;
  learningHours: number;
};

export function CredentialDetails({
  recipientName,
  issuedDate,
  credentialId,
  learningHours,
}: CredentialDetailsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2 xl:grid-cols-4">
      {/* Recipient */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UserRound className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Recipient
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-foreground">
            {recipientName}
          </p>
        </div>
      </div>

      {/* Learning Hours */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Clock3 className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Learning Hours
          </p>

          <p className="mt-1 text-sm font-semibold text-foreground">
            {learningHours} {learningHours === 1 ? "hour" : "hours"}
          </p>
        </div>
      </div>

      {/* Date Issued */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Award className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Date Issued
          </p>

          <p className="mt-1 text-sm font-semibold text-foreground">
            {issuedDate}
          </p>
        </div>
      </div>

      {/* Credential ID */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <IdCard className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Credential ID
          </p>

          <p className="mt-1 truncate font-mono text-xs font-semibold text-foreground">
            {credentialId}
          </p>
        </div>
      </div>
    </div>
  );
}
