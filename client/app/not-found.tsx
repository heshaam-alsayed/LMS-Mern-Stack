import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  LayoutDashboard,
  SearchX,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const quickLinks = [
  {
    href: "/courses",
    label: "Browse Courses",
    description: "Explore the full catalog",
    icon: BookOpen,
  },
  {
    href: "/",
    label: "Go Home",
    description: "Back to the landing page",
    icon: Compass,
  },
  {
    href: "/instructor/organization-courses",
    label: "Instructor Dashboard",
    description: "Manage your organization",
    icon: LayoutDashboard,
  },
];

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-10 text-foreground sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--primary)_0%,transparent_55%)] opacity-[0.07]" />

      <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full border border-border/60" />

      <div className="pointer-events-none absolute -left-12 top-24 size-48 rounded-full border border-border/60" />

      <div className="pointer-events-none absolute -bottom-28 -right-24 size-80 rounded-full border border-border/60" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col items-center justify-center text-center">
        <div className="relative">
          <p className="select-none bg-gradient-to-b from-foreground to-muted-foreground/30 bg-clip-text font-serif text-[7rem] font-bold leading-none tracking-tight text-transparent sm:text-[11rem]">
            404
          </p>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex size-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm sm:size-24">
              <SearchX className="size-9 text-muted-foreground/70 sm:size-11" />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Page Not Found
          </span>

          <span className="size-1 rounded-full bg-muted-foreground/40" />

          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-muted-foreground/60" />
            Error 404
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          This page took a wrong turn
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          The page you are looking for was moved, deleted, or never existed in
          the first place. Check the address, or head back to somewhere that
          definitely exists.
        </p>

        <div className="mt-8 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button asChild className="h-11 gap-2 shadow-sm">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-11 gap-2">
            <Link href="/courses">
              <SearchX className="size-4" />
              Browse Courses
            </Link>
          </Button>
        </div>

        <div className="mt-12 w-full">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Or try one of these
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/40 hover:bg-accent/40">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <link.icon className="size-4" />
                </div>

                <p className="mt-3 text-sm font-semibold text-foreground">
                  {link.label}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}