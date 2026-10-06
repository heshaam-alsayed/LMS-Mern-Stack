"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Compass,
  GraduationCap,
  LifeBuoy,
  UserRound,
} from "lucide-react";

import { getAllCategories } from "@/lib/api/getAllCategories";

import CheckOrganizationModal from "@/components/modal/CheckOrganizationModal";

type FooterCategory = {
  _id: string;
  title: string;
};

type FooterLink = {
  label: string;
  href: string;
  needsEmail?: boolean;
};

type FooterColumn = {
  title: string;
  icon: typeof Compass;
  links: FooterLink[];
};

const MAX_CATEGORY_LINKS = 6;

// every link below points to a page that exists in client/app
const footerColumns: FooterColumn[] = [
  {
    title: "Explore",
    icon: Compass,
    links: [
      { label: "All Courses", href: "/courses" },
      { label: "Newest Courses", href: "/courses?sort=-createdAt" },
      { label: "Top Rated", href: "/courses?sort=-ratings" },
      { label: "Most Reviewed", href: "/courses?sort=-reviewsCount" },
      { label: "Most Lectures", href: "/courses?sort=-totalLectures" },
    ],
  },
  {
    title: "Your Account",
    icon: UserRound,
    links: [
      { label: "Create Account", href: "/signup" },
      { label: "Log In", href: "/login" },
      { label: "Reset Password", href: "/forgot-password" },
      { label: "Teach With Us", href: "/organization/register" },
      {
        label: "Application Status",
        href: "/organization/application",
        needsEmail: true,
      },
    ],
  },
  {
    title: "Support",
    icon: LifeBuoy,
    links: [
      { label: "Help Center", href: "/faq" },
      { label: "About Us", href: "/about" },
      { label: "Policy & Terms", href: "/policy" },
      { label: "Privacy & Security", href: "/policy/privacy-and-security" },
    ],
  },
];

const bottomLinks = [
  { label: "About Us", href: "/about" },
  { label: "Help Center", href: "/faq" },
  { label: "Policy & Terms", href: "/policy" },
];

const linkClasses =
  "inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm";

const ctaClasses =
  "group inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function ColumnLinks({
  links,
  onRequestEmail,
}: {
  links: FooterLink[];
  onRequestEmail: () => void;
}) {
  return (
    <ul className="mt-5 space-y-3.5">
      {links.map((link) => (
        <li key={link.href + link.label}>
          {link.needsEmail ? (
            <button type="button" onClick={onRequestEmail} className={linkClasses}>
              {link.label}
            </button>
          ) : (
            <Link href={link.href} className={linkClasses}>
              {link.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const router = useRouter();

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusEmail, setStatusEmail] = useState("");

  const openStatusDialog = () => setIsStatusDialogOpen(true);

  const handleCheckStatus = () => {
    const trimmedEmail = statusEmail.trim().toLowerCase();

    if (!trimmedEmail) return;

    setIsStatusDialogOpen(false);

    router.push(
      `/organization/application?email=${encodeURIComponent(trimmedEmail)}`,
    );
  };

  // the courses page reads the same key so the request is shared
  const { data: categoryData, isPending: isPendingCategories } = useQuery({
    queryKey: ["all-categories"],
    queryFn: getAllCategories,
    staleTime: 60 * 60 * 1000,
  });

  const categories: FooterCategory[] = (
    categoryData?.categories || []
  ).slice(0, MAX_CATEGORY_LINKS);

  return (
    <footer className="relative overflow-hidden border-t border-border bg-muted/20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 size-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-40 bottom-0 size-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-border py-14 lg:py-16">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <GraduationCap className="size-3.5" />
              Start learning today
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Build skills that move
              <span className="text-primary"> your career forward.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Learn from expert instructors, master in-demand skills, and take the
              next step toward your goals.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/courses" className={ctaClasses}>
                Explore Courses
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/signup"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>

        <div className="py-14 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
            <div className="max-w-sm">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm">
                Learn
                <span className="text-primary">Hub</span>
              </Link>

              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                A modern learning platform designed to help you learn practical
                skills, build confidence, and grow your career.
              </p>

              <Link
                href="/courses"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm">
                Browse the catalog
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
              {footerColumns.map((column) => {
                const Icon = column.icon;

                return (
                  <div key={column.title}>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Icon className="size-4 text-primary" />
                      {column.title}
                    </h3>

                    <ColumnLinks
                      links={column.links}
                      onRequestEmail={openStatusDialog}
                    />
                  </div>
                );
              })}

              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <GraduationCap className="size-4 text-primary" />
                  Categories
                </h3>

                {isPendingCategories ? (
                  <ul className="mt-5 space-y-3.5">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <li
                        key={index}
                        className="h-4 w-24 animate-pulse rounded-full bg-muted"
                      />
                    ))}
                  </ul>
                ) : (
                  <ColumnLinks
                    onRequestEmail={openStatusDialog}
                    links={[
                      ...categories.map((category) => ({
                        label: category.title,
                        href: `/courses?category=${category._id}`,
                      })),
                      { label: "All Categories", href: "/courses" },
                    ]}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground sm:text-sm">
            © {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            {bottomLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:text-sm">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CheckOrganizationModal
        isOpen={isStatusDialogOpen}
        handleDialogChange={setIsStatusDialogOpen}
        email={statusEmail}
        setEmail={setStatusEmail}
        handleCheckStatus={handleCheckStatus}
      />
    </footer>
  );
}
