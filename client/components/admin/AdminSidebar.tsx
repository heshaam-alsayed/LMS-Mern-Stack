"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Database,
  BookOpen,
  Palette,
  Users,
  Receipt,
  PlusCircle,
  Radio,
  ImageIcon,
  CircleHelp,
  Tags,
  ChevronDown,
  ChevronLeft,
  UserCog,
  Pencil,
  LucideLayoutDashboard,
  ShoppingCart,
  BarChart3,
  Bell,
  UserPlus,
  ClipboardCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";

type MenuItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
};

type MenuSection = {
  title: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  items: MenuItem[];
};

type AdminSidebarProps = {
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  collapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
};

export default function AdminSidebar({
  mobileOpen = false,
  onMobileOpenChange = () => {},
  collapsed,
  onCollapseChange,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isEditCourse = pathname.startsWith("/admin/edit-course/");
  const contentItems = [
    {
      title: "Create Course",
      href: "/admin/create-course",
      icon: PlusCircle,
    },
    {
      title: "Live Courses",
      href: "/admin/courses",
      icon: Radio,
    },
  ];

  if (isEditCourse) {
    contentItems.push({
      title: "Edit Course",
      href: pathname,
      icon: Pencil,
    });
  }
  const menuSections: MenuSection[] = [
    {
      title: "Data",
      icon: Database,
      items: [
        {
          title: "Users",
          href: "/admin/users",
          icon: Users,
        },
        {
          title: "Invoices",
          href: "/admin/invoices",
          icon: Receipt,
        },
        {
          title: "Notifications",
          href: "/admin/notifications",
          icon: Bell,
        },
      ],
    },

    {
      title: "Analytics",
      icon: BarChart3,
      items: [
        {
          title: "Courses Analytics",
          href: "/admin/analytics/courses-analytics",
          icon: BookOpen,
        },
        {
          title: "Orders Analytics",
          href: "/admin/analytics/orders-analytics",
          icon: ShoppingCart,
        },
        {
          title: "Users Analytics",
          href: "/admin/analytics/users-analytics",
          icon: Users,
        },
      ],
    },

    {
      title: "Controllers",
      icon: UserCog,
      items: [
        {
          title: "Manage Team",
          href: "/admin/team",
          icon: UserCog,
        },
        {
          title: "Instructor Applications",
          href: "/admin/instructor-applications",
          icon: ClipboardCheck,
        },
      ],
    },

    {
      title: "Content",
      icon: BookOpen,
      items: contentItems,
    },

    {
      title: "Customization",
      icon: Palette,
      items: [
        {
          title: "Hero",
          href: "/admin/customization/hero",
          icon: ImageIcon,
        },
        {
          title: "FAQ",
          href: "/admin/customization/FAQ",
          icon: CircleHelp,
        },
        {
          title: "Categories",
          href: "/admin/customization/categories",
          icon: Tags,
        },
        {
          title: "Layout",
          href: "/admin/customization/layout",
          icon: LucideLayoutDashboard,
        },
      ],
    },
  ];
  const [openSection, setOpenSection] = useState<string | null>(null);

  const isCollapsedView = collapsed && !mobileOpen;

  useEffect(() => {
    onMobileOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const toggleSection = (title: string) => {
    if (isCollapsedView) return;

    setOpenSection((current) => (current === title ? null : title));
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden="true"
          onClick={() => onMobileOpenChange(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] shrink-0 flex-col",
          "border-r border-border bg-background",
          "transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:transition-[width]",
          collapsed ? "lg:w-[72px]" : "lg:w-[280px]",
        )}>
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-border",
            isCollapsedView ? "justify-center px-2" : "justify-between px-4",
          )}>
          {/* Logo */}
          <Link
            href="/admin"
            title={isCollapsedView ? "Admin Dashboard" : undefined}
            className={cn(
              "flex items-center gap-3",
              isCollapsedView && "justify-center",
            )}>
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                "bg-primary/10 text-primary",
              )}>
              <LayoutDashboard className="h-5 w-5" />
            </div>

            {!isCollapsedView && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  Admin Dashboard
                </span>

                <span className="text-[11px] text-muted-foreground">
                  Management Panel
                </span>
              </div>
            )}
          </Link>

          {!isCollapsedView && (
            <button
              type="button"
              onClick={() => {
                onCollapseChange(true);
                setOpenSection(null);
              }}
              aria-label="Collapse sidebar"
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex">
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* Dashboard */}
          <Link
            href="/admin"
            title={isCollapsedView ? "Dashboard" : undefined}
            className={cn(
              "mb-2 flex items-center rounded-lg text-sm font-medium transition-colors",
              isCollapsedView ? "h-11 justify-center" : "gap-3 px-3 py-2.5",

              isActive("/admin")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}>
            <LayoutDashboard className="h-5 w-5 shrink-0" />

            {!isCollapsedView && <span>Dashboard</span>}
          </Link>

          {/* Divider */}
          {!isCollapsedView && (
            <p className="mb-2 mt-5 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Management
            </p>
          )}

          {/* ================================= */}
          {/* SECTIONS */}
          {/* ================================= */}

          <div className="space-y-1">
            {menuSections.map((section) => {
              const SectionIcon = section.icon;

              const isOpen = openSection === section.title;

              const hasActiveItem = section.items.some((item) =>
                isActive(item.href),
              );

              return (
                <div key={section.title}>
                  {/* Section */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.title)}
                    title={isCollapsedView ? section.title : undefined}
                    className={cn(
                      "group flex w-full items-center rounded-lg text-sm font-medium transition-colors",

                      isCollapsedView
                        ? "h-11 justify-center"
                        : "gap-3 px-3 py-2.5",

                      hasActiveItem
                        ? "text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}>
                    <SectionIcon className="h-5 w-5 shrink-0" />

                    {!isCollapsedView && (
                      <>
                        <span className="flex-1 text-left">
                          {section.title}
                        </span>

                        <motion.div
                          animate={{
                            rotate: isOpen ? 0 : -90,
                          }}
                          transition={{
                            duration: 0.2,
                          }}>
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </>
                    )}
                  </button>

                  {/* ================================= */}
                  {/* DROPDOWN */}
                  {/* ================================= */}

                  <AnimatePresence initial={false}>
                    {!isCollapsedView && isOpen && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.2,
                          ease: "easeOut",
                        }}
                        className="overflow-hidden">
                        <div className="ml-5 mt-1 space-y-1 border-l border-border pl-3">
                          {section.items.map((item) => {
                            const Icon = item.icon;

                            const active = isActive(item.href);

                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                  "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",

                                  active
                                    ? "bg-primary/10 font-medium text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                )}>
                                <Icon className="h-4 w-4 shrink-0" />

                                <span>{item.title}</span>

                                {/* Active indicator */}
                                {active && (
                                  <motion.span
                                    layoutId="admin-active"
                                    className="absolute -left-[17px] h-5 w-0.5 rounded-full bg-primary"
                                  />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </nav>

        {/* ================================= */}
        {/* EXPAND BUTTON */}
        {/* ================================= */}

        {isCollapsedView && (
          <div className="hidden border-t border-border p-3 lg:block">
            <button
              type="button"
              onClick={() => onCollapseChange(false)}
              aria-label="Expand sidebar"
              className="flex h-10 w-full items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <ChevronLeft className="h-5 w-5 rotate-180" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
