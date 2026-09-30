"use client";

import {
  ArrowRight,
  Award,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type GenerateCertificateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  isPending: boolean;
  onGenerate: () => void;
};

export default function GenerateCertificateModal({
  open,
  onOpenChange,
  courseTitle,
  isPending,
  onGenerate,
}: GenerateCertificateModalProps) {
  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent
        className="
          w-[calc(100%-2rem)]
          max-w-xl
          overflow-hidden
          border-border/60
          bg-background
          p-0
          shadow-2xl
          sm:rounded-2xl
        ">
        {/* Header */}
        <div className="relative overflow-hidden border-b bg-gradient-to-br from-primary/[0.08] via-background to-background px-6 py-7 sm:px-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex items-center gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <Award className="h-7 w-7" />

              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-emerald-500 text-white">
                <CheckCircle2 className="h-3 w-3" />
              </span>
            </div>

            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                Course Completed
                <Sparkles className="h-4 w-4 text-primary" />
              </DialogTitle>

              <DialogDescription className="text-sm">
                Congratulations! Your certificate is ready.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 sm:px-8">
          <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Award className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Certificate of Completion
                </p>

                <h3 className="line-clamp-2 text-sm font-semibold leading-5 sm:text-base">
                  {courseTitle}
                </h3>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />

            <span>
              Your registered name and course information will appear on the
              certificate.
            </span>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="border-t bg-muted/20 px-6 py-4 sm:px-8">
          <div className="flex pb-4 w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              className="h-10 w-full sm:w-auto">
              Cancel
            </Button>

            <Button
              type="button"
              disabled={isPending}
              onClick={onGenerate}
              className="h-10 w-full gap-2 px-5 shadow-sm sm:w-auto">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Award className="h-4 w-4" />
                  Generate Certificate
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
