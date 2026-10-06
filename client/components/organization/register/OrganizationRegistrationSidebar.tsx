import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  GraduationCap,
  UsersRound,
} from "lucide-react";

const benefits = [
  {
    icon: Building2,
    title: "Your organization",
    description: "A dedicated space for your courses and learning content.",
  },
  {
    icon: BookOpen,
    title: "Your courses",
    description: "Create, publish, and manage your courses in one place.",
  },
  {
    icon: UsersRound,
    title: "Your students",
    description: "Build your audience and monitor student activity.",
  },
];

export default function OrganizationRegistrationSidebar() {
  return (
    <aside className="relative hidden h-full min-h-0 overflow-hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
      <div className="relative z-10 flex h-full flex-col px-6 py-6 xl:px-7">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex w-fit items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
              <GraduationCap className="size-4" />
            </div>

            <span className="text-base font-semibold tracking-tight">
              LMS
            </span>
          </Link>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-sidebar-border bg-sidebar-accent px-2.5 py-1">
            <span className="text-[11px] font-medium text-sidebar-accent-foreground">
              Instructor registration
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="my-auto max-w-sm">
          <h1 className="text-2xl font-bold leading-tight tracking-tight xl:text-3xl">
            Turn your expertise into a learning experience.
          </h1>

          <p className="mt-3 text-xs leading-5 text-sidebar-foreground/70 xl:text-sm">
            Create your organization, publish courses, and build your learning
            community from one platform.
          </p>

          <div className="mt-5 space-y-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="flex gap-2.5 rounded-lg border border-sidebar-border bg-sidebar-accent p-2.5"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-foreground/10 text-sidebar-foreground">
                    <Icon className="size-3.5" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-xs font-semibold">
                      {benefit.title}
                    </h2>

                    <p className="mt-0.5 text-[11px] leading-4 text-sidebar-foreground/65">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Approval notice */}
          <div className="mt-4 flex gap-2.5 rounded-lg border border-sidebar-border bg-sidebar-accent p-2.5">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-sidebar-foreground" />

            <div className="min-w-0">
              <p className="text-[11px] font-semibold">
                Admin approval required
              </p>

              <p className="mt-0.5 text-[10px] leading-4 text-sidebar-foreground/60">
                Your application will be reviewed before instructor access is
                enabled.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-sidebar-border pt-3">
          <p className="text-[10px] text-sidebar-foreground/60">
            Already have an account?
          </p>

          <Link
            href="/login"
            className="group inline-flex items-center gap-1 text-[11px] font-medium text-sidebar-foreground/85 hover:text-sidebar-foreground"
          >
            Sign in
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
} 