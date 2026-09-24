"use client";

import Image from "next/image";
import Link from "next/link";
import { BarChart3, BookOpen, LayoutDashboard, Users } from "lucide-react";

import { InstructorHeaderMenu } from "./InstructorHeaderMenu";
import { InstructorMobileMenu } from "./InstructorMobileMenu";
import { InstructorNotifications } from "./InstructorNotifications";
import { InstructorTheme } from "./InstructorTheme";

const contentItems = [
  {
    label: "My Courses",
    href: "/instructor/courses",
  },
  {
    label: "Create Course",
    href: "/instructor/create-course",
  },
  {
    label: "Live Courses",
    href: "/instructor/live-courses",
  },
];

const studentsItems = [
  {
    label: "My Students",
    href: "/instructor/students",
  },
];

const analyticsItems = [
  {
    label: "Courses Analytics",
    href: "/instructor/analytics/courses",
  },
];

export function InstructorHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/instructor" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={36} height={36} priority />

            <span className="hidden font-semibold md:block">Instructor</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {/* Dashboard */}
            <Link
              href="/instructor"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            {/* Content */}
            <InstructorHeaderMenu
              title="Content"
              icon={BookOpen}
              items={contentItems}
            />

            {/* Students */}
            <InstructorHeaderMenu
              title="Students"
              icon={Users}
              items={studentsItems}
            />

            {/* Analytics */}
            <InstructorHeaderMenu
              title="Analytics"
              icon={BarChart3}
              items={analyticsItems}
            />
          </nav>

          {/* Mobile */}
          <InstructorMobileMenu
            contentItems={contentItems}
            studentsItems={studentsItems}
            analyticsItems={analyticsItems}
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <InstructorNotifications />
          <InstructorTheme />
        </div>
      </div>
    </header>
  );
}
