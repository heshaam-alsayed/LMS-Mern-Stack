"use client";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  HelpCircle,
  LayoutDashboard,
  Tags,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Layout } from "@/types/layout.type";

type Props = {
  layout: Layout;
};

const layoutInfo = {
  banner: {
    title: "Hero Banner",
    description:
      "Manage the hero section displayed on your platform.",
    icon: LayoutDashboard,
  },

  faq: {
    title: "FAQ",
    description:
      "Manage frequently asked questions and answers.",
    icon: HelpCircle,
  },

  categories: {
    title: "Categories",
    description:
      "Manage the categories displayed on your platform.",
    icon: Tags,
  },
};

const layoutRoutes = {
  banner: "/admin/customization/hero",
  faq: "/admin/customization/FAQ",
  categories: "/admin/customization/categories",
};

export default function LayoutCard({
  layout,
}: Props) {
  const router = useRouter();

  const info = layoutInfo[layout.type];
  const Icon = info.icon;

  const handleManage = () => {
    router.push(layoutRoutes[layout.type]);
  };

  const createdDate = new Date(
    layout.createdAt,
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const updatedDate = new Date(
    layout.updatedAt,
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate font-semibold text-foreground">
              {info.title}
            </h2>

            <span className="mt-1 inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize text-muted-foreground">
              {layout.type}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-5 min-h-10 text-sm leading-relaxed text-muted-foreground">
        {info.description}
      </p>

      {/* Dates */}
      <div className="mt-5 space-y-3 rounded-xl border border-border bg-muted/30 p-3">
        {/* Created */}
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
            <CalendarDays className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              Created
            </p>

            <p className="text-sm font-medium text-foreground">
              {createdDate}
            </p>
          </div>
        </div>

        {/* Updated */}
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
            <Clock3 className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              Last updated
            </p>

            <p className="text-sm font-medium text-foreground">
              {updatedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={handleManage}
        className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
        Manage Layout

        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}