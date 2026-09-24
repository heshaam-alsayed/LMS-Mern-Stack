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
    <aside className="relative hidden h-full min-h-0 overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col">
      {/* Content */}
      <div className="relative z-10 flex h-full flex-col px-6 py-6 xl:px-7">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="inline-flex w-fit items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
              <GraduationCap className="size-4" />
            </div>

            <span className="text-base font-semibold tracking-tight">LMS</span>
          </Link>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1">
            <span className="text-[11px] font-medium text-primary-foreground/70">
              Instructor registration
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="my-auto max-w-sm">
          {/* Heading */}
          <h1 className="max-w-sm text-2xl font-bold leading-tight tracking-tight xl:text-3xl">
            Turn your expertise into a learning experience.
          </h1>

          {/* Description */}
          <p className="mt-3 max-w-sm text-xs leading-5 text-primary-foreground/60 xl:text-sm">
            Create your organization, publish courses, and build your learning
            community from one platform.
          </p>

          {/* Benefits */}
          <div className="mt-5 space-y-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="flex gap-2.5 rounded-lg border border-white/10 bg-white/[0.05] p-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/10">
                    <Icon className="size-3.5" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-xs font-semibold">{benefit.title}</h2>

                    <p className="mt-0.5 text-[11px] leading-4 text-primary-foreground/50">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Approval Notice */}
          <div className="mt-4 flex gap-2.5 rounded-lg border border-white/10 bg-black/10 p-2.5">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary-foreground/60" />

            <div className="min-w-0">
              <p className="text-[11px] font-semibold">
                Admin approval required
              </p>

              <p className="mt-0.5 text-[10px] leading-4 text-primary-foreground/45">
                Your application will be reviewed before instructor access is
                enabled.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <p className="text-[10px] text-primary-foreground/35">
            Already have an account?
          </p>

          <Link
            href="/login"
            className="group inline-flex items-center gap-1 text-[11px] font-medium text-primary-foreground/65 transition-colors hover:text-primary-foreground">
            Sign in
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
