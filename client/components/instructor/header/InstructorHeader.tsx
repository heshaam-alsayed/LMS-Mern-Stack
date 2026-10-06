"use client";

import Link from "next/link";
import {
  Award,
  BarChart3,
  BookOpen,
  FilePlus2,
  LayoutDashboard,
  PlayCircle,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

import { InstructorHeaderMenu } from "./InstructorHeaderMenu";
import {
  InstructorMobileMenu,
  type InstructorNavItem,
} from "./InstructorMobileMenu";
import { InstructorNotifications } from "./InstructorNotifications";
import { InstructorTheme } from "./InstructorTheme";
import {
  ACCOUNT_ITEMS,
  InstructorAccountMenu,
} from "./InstructorAccountMenu";
import InstructorDashboardLink from "./InstructorDashboardLink";
import InstructorOrdersLink from "./InstructorOrdersLink";
import InstructorStudentsLink from "./InstructorStudentsLink";
import InstructorCertificatesLink from "./InstructorCertificatesLink";

const dashboardItem: InstructorNavItem = {
  label: "Dashboard",
  href: "/instructor",
  icon: LayoutDashboard,
};

const contentItems: InstructorNavItem[] = [
  {
    label: "Live Courses",
    href: "/instructor/organization-courses",
    icon: PlayCircle,
  },
  {
    label: "Create Course",
    href: "/instructor/create-course",
    icon: FilePlus2,
  },
  {
    label: "Certificates",
    href: "/instructor/organization-certificates",
    icon: Award,
  },
];

const manageItems: InstructorNavItem[] = [
  {
    label: "Orders",
    href: "/instructor/organization-orders",
    icon: ShoppingCart,
  },
  {
    label: "Students",
    href: "/instructor/organization-students",
    icon: Users,
  },
  {
    label: "Certificates",
    href: "/instructor/organization-certificates",
    icon: Award,
  },
];

const analyticsItems: InstructorNavItem[] = [
  {
    label: "Courses Analytics",
    href: "/instructor/analytics/courses",
    icon: BarChart3,
  },
  {
    label: "Orders Analytics",
    href: "/instructor/analytics/orders",
    icon: TrendingUp,
  },
];

export function InstructorHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between gap-2 px-4 lg:px-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5 lg:mr-6 lg:gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary font-bold text-primary-foreground lg:size-10">
              L
            </div>

            <div className="min-w-0">
              <h1 className="text-base font-bold leading-tight lg:text-lg">
                LMS
              </h1>

              <p className="hidden text-xs leading-tight text-muted-foreground md:hidden xl:block">
                Learning Platform
              </p>
            </div>
          </Link>

          <nav className="hidden items-center md:flex md:ml-2 ">
            <InstructorDashboardLink />

            <InstructorOrdersLink />

            <InstructorStudentsLink />
            <div className="mx-2 hidden h-5 w-px shrink-0 bg-border lg:block" />

            <InstructorHeaderMenu
              title="Content"
              icon={BookOpen}
              items={contentItems}
            />

            <InstructorHeaderMenu
              title="Analytics"
              icon={BarChart3}
              items={analyticsItems}
            />
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <div className="hidden md:block">
            <InstructorTheme />
          </div>

          <InstructorNotifications />

          <div className="md:hidden">
            <InstructorMobileMenu
              dashboardItem={dashboardItem}
              contentItems={contentItems}
              manageItems={manageItems}
              analyticsItems={analyticsItems}
              accountItems={ACCOUNT_ITEMS}
            />
          </div>

          <div className="hidden md:block">
            <InstructorAccountMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
