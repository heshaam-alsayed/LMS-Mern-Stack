import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";

interface OrganizationRegistrationSuccessProps {
  organizationName?: string;
}

export default function OrganizationRegistrationSuccess({
  organizationName,
}: OrganizationRegistrationSuccessProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-3xl" />
        <div className="absolute bottom-0 right-0 size-[350px] translate-x-1/3 translate-y-1/3 rounded-full bg-primary/[0.04] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full">
          {/* Success icon */}
          <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-[0_0_0_8px_rgba(0,0,0,0.02)]">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <CheckCircle2 className="size-7" strokeWidth={2.2} />
            </div>
          </div>

          {/* Heading */}
          <div className="mt-6 text-center">
            <div className="mb-2 inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1">
              <span className="text-xs font-medium text-muted-foreground">
                Registration complete
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Application submitted
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
              Your organization application is now under review. We’ll enable
              your instructor access once it has been approved.
            </p>
          </div>

          {/* Application status card */}
          <div className="mt-8 overflow-hidden rounded-2xl border bg-card shadow-sm">
            {/* Organization */}
            {organizationName && (
              <div className="border-b p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Organization
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold sm:text-base">
                      {organizationName}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Instructor organization
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-4 bg-muted/20 p-5 sm:p-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock3 className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold">Pending admin approval</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                  Your application is being reviewed. You can sign in once your
                  account has been approved.
                </p>
              </div>

              <span className="ml-auto shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                Pending
              </span>
            </div>
          </div>

          {/* Action */}
          <div className="mt-7 flex flex-col items-center gap-3">
            <Link
              href="/login"
              className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md sm:w-auto sm:min-w-48">
              Back to login
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <p className="text-center text-xs text-muted-foreground">
              You can return to this page anytime by using your application
              status link.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
