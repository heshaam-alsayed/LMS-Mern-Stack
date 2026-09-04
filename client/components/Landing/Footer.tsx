"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { CiInstagram, CiLinkedin, CiTwitter } from "react-icons/ci";

const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "All Courses", href: "/courses" },
      { label: "Categories", href: "/categories" },
      { label: "Instructors", href: "/instructors" },
      { label: "Certificates", href: "/certificates" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Web Development", href: "/courses/web-development" },
      { label: "UI / UX Design", href: "/courses/ui-ux" },
      { label: "Programming", href: "/courses/programming" },
      { label: "Business", href: "/courses/business" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Help Center", href: "/help" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: FaFacebook,
  },
  {
    label: "Twitter",
    href: "#",
    icon: CiTwitter,
  },
  {
    label: "Instagram",
    href: "#",
    icon: CiInstagram,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: CiLinkedin,
  },
  {
    label: "GitHub",
    href: "#",
    icon: FaGithub,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-muted/20">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 size-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-40 bottom-0 size-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* CTA */}
        <div className="border-b border-border py-14 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                Start learning today
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Build skills that move
                <span className="text-primary"> your career forward.</span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Learn from expert instructors, master in-demand skills, and take
                the next step toward your goals.
              </p>
            </div>

            <Link
              href="/courses"
              className="
                group
                inline-flex
                w-fit
                shrink-0
                items-center
                gap-2
                rounded-full
                bg-primary
                px-5
                py-3
                text-sm
                font-semibold
                text-primary-foreground
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
              ">
              Explore Courses
              <ArrowUpRight
                className="
                  size-4
                  transition-transform
                  duration-200
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </Link>
          </div>
        </div>

        {/* Footer content */}
        <div className="py-14 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
            {/* Brand */}
            <div className="max-w-sm">
              <Link
                href="/"
                className="inline-flex items-center text-2xl font-bold tracking-tight text-foreground">
                Learn
                <span className="text-primary">Hub</span>
              </Link>

              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                A modern learning platform designed to help you learn practical
                skills, build confidence, and grow your career.
              </p>

              {/* Social */}
              <div className="mt-7 flex items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="
                        flex
                        size-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-border
                        bg-background/60
                        text-muted-foreground
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:border-primary/30
                        hover:bg-primary/5
                        hover:text-primary
                      ">
                      <Icon className="size-4" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 4 Columns */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h3 className="text-sm font-semibold text-foreground">
                    {column.title}
                  </h3>

                  <ul className="mt-5 space-y-3.5">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="
                            text-sm
                            text-muted-foreground
                            transition-colors
                            duration-200
                            hover:text-primary
                          ">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="
            flex
            flex-col
            gap-4
            border-t
            border-border
            py-6
            sm:flex-row
            sm:items-center
            sm:justify-between
          ">
          <p className="text-xs text-muted-foreground sm:text-sm">
            © {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/terms"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm">
              Terms
            </Link>

            <Link
              href="/privacy"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm">
              Privacy
            </Link>

            <Link
              href="/cookies"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
