"use client";

import {
  ExternalLink,
  Link2,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type CertificateActionsProps = {
  onLinkedIn?: () => void;
  onVerify?: () => void;
};

export function CertificateActions({
  onLinkedIn,
  onVerify,
}: CertificateActionsProps) {
  return (
    <>
      {/* Share Achievement */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/30 p-5">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Link2 className="size-5" />
          </div>

          <h3 className="font-semibold tracking-tight">
            Share Your Achievement
          </h3>

          <p className="mt-2 text-sm leading-5 text-muted-foreground">
            Showcase your new skills and add this certificate to your
            professional profile.
          </p>
        </div>

        <div className="p-4">
          <Button
            onClick={onLinkedIn}
            variant="outline"
            className="w-full gap-2"
          >
            <Link2 className="size-4" />
            Add to LinkedIn
            <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Verification */}
      <button
        type="button"
        onClick={onVerify}
        className="
          group
          flex
          w-full
          items-center
          gap-3
          rounded-2xl
          border
          border-border
          bg-card
          p-4
          text-left
          shadow-sm
          transition-colors
          hover:bg-muted/50
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
        "
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            Verify Certificate
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            View public credential verification
          </p>
        </div>

        <ExternalLink className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
      </button>
    </>
  );
}